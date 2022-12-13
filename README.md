# stack-eda-services
## Overview
Contains the production and development docker-compose files to deploy the entire set of EDA services

## Subsetting Files
In order run the map-reduce file-based subsetting locally, you need to choose a directory on your local machine where you would like to store the EDA binary files.

## Container Deployment
### Prerequisites
In order to deploy the EDA stack locally, the following is required:
#### Docker
Docker must be installed on your local machine, this can be done by following [these instructions](https://docs.docker.com/engine/install/).

#### Traefik
Traefik is required to expose your docker services to your local machine. This can be run by cloning the [VEuPathDB traefik repository](https://github.com/VEuPathDB/docker-traefik) and running `docker-compose up -d` from within its root directory.

#### Sshuttle
Sshuttle allows your docker services (and local machine in general) to communicate with the necessary databases. This can be run by cloning the [VEuPathDB sshuttle repository](https://github.com/VEuPathDB/sshuttle).

Before running, you will need to update the `sshuttle.conf` file to specify a valid remote host. Note that the default configuration may contain a host that no longer exists. Once you have set the configuration, run 

```shell
./sshuttle.sh start --docker
```

#### GitHub Credentials
`$GITHUB_TOKEN` and `$GITHUB_USER` environment variables need to be set to credentials with read access to VEuPathDB projects. See [creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for more details.


### Deploying the Stack

#### 1. Set Environment Variables
This step only needs to be done once, after this project is checked out. Run `cp env.sample .env`. This file contains sane defaults for all the environment variables required by the EDA services. Most can be left as is, but some values such as passwords, secrets and hostnames must be filled in.

#### 2a. (Optional) Build Images
If you have made changes to any of the services, you will need to rebuild the image in order for your changes to take effect. For convenience, the `docker-build` directory of this project contains a docker file per service, that can be included if you have changes staged for the respective service.

> :warning: Any services which you would like to rebuild must be checked out in the same parent directory that this repository is located in. The convenient build files provided will look there for the EDA project source code.

The following command can be run to trigger the build:

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-build/docker-compose-build-<service-name>.yml build
```

Note that you can include one or more services in the build by adding `-f docker-build/docker-compose-build-<service-name>.yml` for each service you wish to build.

#### 2b. Deploy the Stack
Note at this point, both Sshuttle and Traefik should be running according to the steps above and your GitHub credentials should be configured as environment variables.

Bringing up the stack using the latest images for each of the services in the EDA stack can be done by simply running:

```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

> :note: If you included any additional files in step 2a., you should include them in the above command as well (I think? I'm not 100% sure if this matters).
