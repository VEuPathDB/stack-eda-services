pulumi --config-file test_config.yaml config set minio:minioServer localhost:9000
pulumi --config-file test_config.yaml config set minio:minioAccessKey ROOTUSER --secret
pulumi --config-file test_config.yaml config set minio:minioSecretKey CHANGEME123 --secret

pulumi --config-file test_config.yaml config set rabbitmq:endpoint localhost:5672
pulumi --config-file test_config.yaml config set rabbitmq:username user --secret
pulumi --config-file test_config.yaml config set rabbitmq:password password --secret

pulumi --config-file test_config.yaml config set infra-eda-compute:rabbitEndpoint localhost:5672
pulumi --config-file test_config.yaml config set infra-eda-compute:rabbitUsername user --secret
pulumi --config-file test_config.yaml config set infra-eda-compute:rabbitPassword password --secret
