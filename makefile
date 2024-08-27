_COLOR := $(shell echo "\\033[38;5;69m")
_RESET := $(shell echo "\\033[0m")

.PHONY: default
default:
	@echo "Please pick a make target."

.PHONY: build
build: sibling-directory-test
	@docker compose \
	  -f docker-compose.yml \
	  -f docker-compose.dev.yml \
	  -f docker-compose.build.yml \
	  build \
	  --build-arg=GITHUB_USERNAME=${GITHUB_USERNAME} \
	  --build-arg=GITHUB_TOKEN=${GITHUB_TOKEN}

api-test: sibling-directory-test test-env-present-test
	@source .testenv && ../service-eda/api-test/gradlew --project-dir ../service-eda/api-test --rerun-tasks api-test

####
##  Stack Management
####

.PHONY: up
up: env-file-test sibling-directory-test
	@docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.build.yml up -d

.PHONY: down
down: env-file-test sibling-directory-test
	@docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.build.yml down -v

.PHONY: start
start: env-file-test sibling-directory-test
	@docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.build.yml start

.PHONY: stop
stop: env-file-test sibling-directory-test
	@docker compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.build.yml stop

####
##  Helpers
####

.PHONY: env-file-test
env-file-test:
	@if [ ! -f .env ]; then echo "Missing .env file."; exit 1; fi

.PHONY: sibling-directory-test
sibling-directory-test:
	@if [ ! -d ../service-eda ]; then echo "Missing directory ../service-eda. The service-eda directory must be a sibling of stack-eda-services."; exit 1; fi

.PHONY: test-env-present-test
test-env-present-test:
	@if [ ! -f ./api-testenv.sh ]; then echo "Missing environment script api-testenv.sh. Run cp api-testenv.sample.sh api-testenv.sh and set the variables in the new file."; exit 1; fi
