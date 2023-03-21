import { input } from "@pulumi/minio/types";
import * as pulumi from "@pulumi/pulumi";
import { exec } from "child_process";

export interface MinioQueueConfigInput {
    queueId: pulumi.Input<string>;
    url: pulumi.Input<string>;
    exchange: pulumi.Input<string>;
    routingKey: pulumi.Input<string>;
    description: pulumi.Input<string>;
}

interface MinioQueueConfigProviderInput {
    queueId: string;
    url: string;
    exchange: string;
    routingKey: string;
    description: string;
}

/**
 * DynamicProviderOutputs represents the output type of `create` function in the
 * dynamic resource provider.
 */
interface MinioQueueConfigProviderOutput extends MinioQueueConfigProviderInput {
}

class MinioQueueConfigProvider implements pulumi.dynamic.ResourceProvider<MinioQueueConfigProviderInput, MinioQueueConfigProviderOutput> {
    private name: string

    constructor(name: string) {
        this.name = name;
    }

    async create(inputs: MinioQueueConfigProviderInput): Promise<pulumi.dynamic.CreateResult> {
        exec(`mc admin config set admin/ notify_amqp:${inputs.queueId} \
                url="${inputs.url}" \
                exchange="${inputs.exchange}" \
                exchange_type="direct" \
                routing_key="${inputs.routingKey}" \
                comment="${inputs.description}" && mc admin service restart admin`, (error, stdout, stderr) => {
            if (error) {
              throw new Error(`exec error: ${error}`);
            }
            console.log(`stdout: ${stdout}`);
          });
        const outs: MinioQueueConfigProviderOutput = {
            ...inputs
        }
        return { id: inputs.queueId, outs: outs };
    }

    async update(id: string, olds: MinioQueueConfigProviderInput, news: MinioQueueConfigProviderInput): Promise<pulumi.dynamic.UpdateResult> {
        console.log("OLDS: " + id);
        exec(`mc admin config set admin/ notify_amqp:${olds.queueId ?? news.queueId} \
                url="${news.url}" \
                exchange="${news.exchange}" \
                exchange_type="direct" \
                routing_key="${news.routingKey}" \
                comment="${news.description}" && mc admin service restart admin`, (error, stdout, stderr) => {
            if (error) {
              throw new Error(`exec error: ${error}`);
            }
            console.log(`stdout: ${stdout}`);
          });

          const outs: MinioQueueConfigProviderOutput = {
            ...news
        }
        return { outs: outs };
    }
    
    async delete(id: string, props: MinioQueueConfigProviderInput) {

    }
}

export class MinioQueueEventsConfig extends pulumi.dynamic.Resource {
    public readonly url: pulumi.Output<string> | undefined;

    constructor(name: string, args: MinioQueueConfigInput, opts?: pulumi.CustomResourceOptions) {
        super(new MinioQueueConfigProvider(name), name, args, opts);

    }
}
