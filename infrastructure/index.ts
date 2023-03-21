import * as pulumi from "@pulumi/pulumi";
import * as minio from "@pulumi/minio";
import * as rabbitmq from "@pulumi/rabbitmq";
import { MinioQueueEventsConfig } from "./mcadmin"

// Retrieve stack configuration values. These will differ depending on environmnet (e.g. prod vs. qa)
const config = new pulumi.Config();

// Rabbit configuration from perspective of minio. This is used by our dynamic resource to configure events.
const rabbitUrl = config.require("rabbitEndpoint"); 
const rabbitUser = config.requireSecret("rabbitUsername"); 
const rabbitPasswd = config.requireSecret("rabbitPassword");
const env = config.require("env") || "dev";

const bucketName = `${env}-test-bucket-with-events`;
const bucket = new minio.S3Bucket("s3Bucket", {
    acl: "public",
    bucket: bucketName,
});

const routingKey = "test-minio-events";
const exchangeName = "minio-events"
const exchange = new rabbitmq.Exchange("testMinioEventsExchange", {
    name: exchangeName,
    settings: {
        type: "direct"
    }
});
const queue = new rabbitmq.Queue("testMinioEventsQueue", {
    settings: {
        autoDelete: false,
        durable: false
    },
});

export const binding = new rabbitmq.Binding("testMinioEventsBinding", {
    destination: queue.name,
    destinationType: "queue",
    routingKey: routingKey,
    source: exchange.name,
    vhost: "/" // default vhost
});

const url = pulumi.all([rabbitUser, rabbitPasswd]).apply(([user, pass]) => `amqp://${user}:${pass}@${rabbitUrl}`)

export const eventsConfig = new MinioQueueEventsConfig("primary", {
    queueId: "primary",
    url: url,
    exchange: exchangeName,
    routingKey: routingKey,
    description: "Testing a cool event config"
});

new minio.S3BucketNotification("bucketS3BucketNotification", {
    bucket: bucket.bucket,
    queues: [{
        id: "notification-queue",
        queueArn: "arn:minio:sqs::primary:amqp",
        events: [
            "s3:ObjectCreated:*",
            "s3:ObjectRemoved:Delete",
        ],
        filterPrefix: "example/",
        filterSuffix: ".txt",
    }],
});
