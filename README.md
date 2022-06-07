# Master cloud apps TFM - Users microservice

## Table of contents
- [Master cloud apps TFM - Users microservice](#master-cloud-apps-tfm---users-microservice)
  - [Table of contents](#table-of-contents)
  - [Description](#description)
  - [Requirements](#requirements)
  - [Technologies](#technologies)
    - [Dependencies](#dependencies)
    - [Development dependencies](#development-dependencies)
  - [Project structure](#project-structure)
  - [Configuration](#configuration)
    - [Properties description](#properties-description)
    - [Helm chart configurable values](#helm-chart-configurable-values)
  - [Usage](#usage)
    - [Installation](#installation)
    - [Run tests](#run-tests)
    - [Run application](#run-application)
      - [Locally](#locally)
      - [As docker container](#as-docker-container)
      - [Checking application is running](#checking-application-is-running)
  - [Contributing](#contributing)
  - [Deployment](#deployment)
    - [PRE](#pre)
    - [PRO](#pro)
    - [Checking application is deployed](#checking-application-is-deployed)
  - [Developers](#developers)

## Description
This service provides:
1. An users API Rest to:
   * Create user.
   * Authenticate as an user.
   * Get user detail (authenticated as user or admin).
   * Add money to the user's balance (authenticated as user or admin).
2. An aministrattors API Rest that allows:
   * Create administrator.
   * Authenticate.as administrator.

## Requirements
The next requirements are necessary to work with this project:
* [npm 6.14.11](https://www.npmjs.com/package/npm/v/6.14.11)
* [node v14.16.0](https://nodejs.org/en/)
* [Docker](https://docs.docker.com/engine/install/) 

* Also is necessary to have access to a [MySQL 8](https://www.mysql.com/) database. You can point to a local instance run:
```
docker-compose -f docker-compose-dev.yml up
```

## Technologies
### Dependencies
* [bcryptjs ^2.4.3 (>=2.4.3 < 2.5.0)](https://www.npmjs.com/package/bcryptjs): For passwords hashing.
* [express ^4.17.1 (>=4.17.1<4.18.0)](https://www.npmjs.com/package/express): Node web framework. 
* [jsonwebtoken ^8.5.1 (>=8.5.1<8.6.0)](https://www.npmjs.com/package/jsonwebtoken): To manage JWT tokens.
* [mysql2 ^2.3.2 (>=2.3.2<2.4.0)](https://www.npmjs.com/package/mysql2): MySQL client for Node.js.
* [sequelize ^6.8.0 (>=6.8.0<6.9.0)](https://www.npmjs.com/package/sequelize):  Node.js ORM tool.
* [kafkajs ^1.16.0 (>=1.16.0<1.17.0)](https://kafka.js.org/docs/getting-started): Apache kafka client for node.js.

### Development dependencies
* [@trendyol/jest-testcontainers ^2.1.0 (>=2.1.0<2.2.0)](https://github.com/Trendyol/jest-testcontainers): Jest preset for running docker containers with our tests.
* [eslint ^7.32.0 (>=7.32.0<7.33.0)](https://www.npmjs.com/package/eslint): tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* [eslint-config-airbnb-base ^14.2.1 (>=14.2.1<14.3.0)](https://www.npmjs.com/package/eslint-config-airbnb-base): provides Airbnb's base JS .eslintrc (without React plugins) as an extensible shared config.
* [eslint-plugin-import ^2.25.2 (>=2.25.2<2.26.0)](https://www.npmjs.com/package/eslint-plugin-import): plugin to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names.
* [eslint-plugin-jest ^25.2.2 (>=25.2.2<25.3.0)](https://www.npmjs.com/package/eslint-plugin-jest): plugin that exports a recommended configuration that enforces good testing practices.
* [husky ^7.0.4 (>=7.0.4<7.1.0)](https://www.npmjs.com/package/husky): dependency to make easier work with git hooks.
* [jest ^27.3.1 (>=27.3.1<27.4.9)](https://jestjs.io/): JavaScript Testing Framework.
* [nodemon ^2.0.14 (>=2.0.14<2.1.0)](https://www.npmjs.com/package/nodemon): tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
* [supertest ^6.1.6 (>=6.1.6<6.2.0)](https://www.npmjs.com/package/supertest): HTTP assertions library that allows to test Node.js HTTP servers.

## Project structure
Project is composed by the next modules:
* **.github/workflows**: contains [github actions](https://docs.github.com/en/actions) workflows of the project.
* **.husky**: here is where the [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) scripts are.
* **apis**: provides api definitions.
  * **rest**: [openapi](https://swagger.io/specification/) definition with REST endpoints.
* **certs**: this folder store the CA certificates.
* **config**: has file with configuration properties.
* **helm/charts**: [helm](https://helm.sh/) chart is defined inside.
  * **templates**: folder with manifests templates of the necessary resources.
  * **Chart.yaml**: file containing information about the chart.
  * **values.yaml**: The default configuration values for this chart.
* **k8s**: k8s manifests and scripts to apply all of them or remove them.
* **postman**: postman collection and environments configuration.
* **src**: source code.
  * **dtos**: request and responses DTOs.
  * **middlewares**: middlewares for authentication and authorization.
  * **models**: database models.
  * **repositories**: database repositories.
  * **routes**: controllers.
  * **services**: services with business logic.
  * **app.js**: maps urls to controllers.
  * **broker.js**: establish kafka connection and listen for topics.
  * **database.js**: establish database connection with a retry mechanism.
  * **kafka.js**: contains kafka client, consumer and producer.
  * **server.js**: launch the app.
* **tests**: application tests.
  * **integration**: integration tests.
  * **unit**: unit tests.
    * **dtos**: DTOs unit tests.
    * **errors**: define error class necessary for tests.
    * **middlewares**: middlewares unit tests.
    * **routes**: controllers unit tests.
    * **services**: services unit tests.
    * **jest.config.unit.js**: jest unit test config (necessary to override default test configuration used for integration test)
* **.dockerignore**: file with files and folders to ignore when generating docker image.
* **.eslintrc.js**: ESLint configuration file.
* **docker-compose-dev.yml**: allows to launch the necessary resources to run the app in local (MySQL database, Kafka broker).
* **docker-compose.yml**: launch the application, along with the necessary resources (MySQL database, Kafka broker), using a local docker image. The image to use is retrieved from the environment variable `DOCKER_LOCAL_IMAGE`.
* **Dockerfile**: contains all the commands to assemble the app image.
* **dockerize.sh**: script responsible for generating the docker image locally with the current code, without uploading it to [Dockerhub](https://hub.docker.com/). To do this, use the environment variable `DOCKER_LOCAL_IMAGE` as the image name (which also adds writes to the `.env` file from which docker-compose retrieves the environment variables to use). Then build the app by running the docker-compose file above.
* **jest-testcontainers-config.js**: file with testcontainers configuration to run integration tests using necessary docker images.
* **jest.config.js**: configuration to preset `@trendyol/jest-testcontainers` module to use containers for testing.
* **LICENSE**: Apache 2 license file.
* **package-lock.json**: is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.
* **package.json**: holds various metadata relevant to the project.
* **README.md**: this file.

## Configuration
Project configuration is in [config/config.js](./config/config.js) file. 
All the properties defined inside it read values from environment variables and, if that variables doesn't exist, then use default values.

Furthermore, project is configured to execute ESLint before executing tests:
```json
"scripts": {
  "pretest": "eslint --ignore-path .gitignore --cache .  --ext .js",
}
```

### Properties description
* **server.port**: Port where the app will run. Read value from `SERVER_PORT` environment value, if not exists, then default value is `8443`.
* **server.key.path**: Server key path. Read value from `KEY_PATH` environment value, if not exists, then default value is `./certs/private-key.pem`.
* **server.cert.path**: Server cert path. Read value from `CERT_PATH` environment value, if not exists, then default value is `./certs/cert.pem`.
* **db.host**: Database host. Read value from `RDS_HOSTNAME` environment value, if not exists, then default value is `localhost`.
* **db.user**: Database username. Read value from `RDS_USERNAME` environment value, if not exists, then default value is `root`.
* **db.password**: Database password. Read value from `RDS_PASSWORD` environment value, if not exists, then default value is `pass`.
* **db.port**: Database port. Read value from `RDS_PORT` environment value, if not exists, then default value is `3306`.
* **db.db_name**: Database name. Read value from `RDS_DB_NAME` environment value, if not exists, then default value is `users`.
* **db.connection.max_retries**: Max retries to connect to database when launching the app. Read value from `CONN_MAX_RETRIES` environment value, if not exists, then default value is `3`.
* **db.connection.retry-interval**: Retry connection interval between connection retries. Read value from `CONN_RETRY_INTERVAL` environment value, if not exists, then default value is `30000` milliseconds.
* **kafka.enabled**: indicates if kafka consumer is enabled.
* **kafka.retry.initialRetryTime**: Initial value used to calculate the kafka retry in milliseconds.
* **kafka.retry.retries**: Max number of kafka retries per call.
* **kafka.host**: kafka host.
* **kafka.port**: kafka port.
* **kafka.groupId**: kafka group identifier.
* **kafka.topics.validateBalance**: validate users balance topic name.
* **kafka.topics.changeState**: order change state topic name.
* **secret**: Secret used to generate JWT tokens. Read value from `TOKEN_SECRET` environment value, if not exists, then default value is `supersecret`.
* **token.expiration**: JWT token expiration time. Read value from `TOKEN_EXPIRATION` environment value, if not exists, then default value is `300` seconds.

### Helm chart configurable values
The next variables are defined to use helm chart in [helm/charts/values.yaml](./helm/charts/values.yaml):
* **namespace**: K8s namespace. By default `tfm-dev-amartinm82`.
* **mysql.create**: Indicates if is necessary to deploy a MySQL container. By default `false`. If this variable is `false` then the __mysql.image.* , mysql.replicas, mysql.resources.*__ variables won't have effect.
* **mysql.image.repository**: database image name. By default `mysql`.
* **mysql.image.tag**: image tag. By default `8.0.27`.
* **mysql.host**: database url. By default `localhost`.
* **mysql.user**: database username. By default `root`.
* **mysql.password**: database password. By default `password`.
* **mysql.database**: database name. By default `users`.
* **mysql.port**: database port. By default `3306`.
* **mysql.replicas**: database replicas. By default `1`.
* **mysql.resources.requests.memory**: database instance requested memory. By default `256Mi`.
* **mysql.resources.requests.cpu**: database instance requested cpu. By default `250m`.
* **mysql.resources.limits.memory**: database instance limit memory. By default `512Mi`.
* **mysql.resources.limits.cpu**: database instance requested cpu. By default `500m`.
* **kafka.enabled**: Indicates if kafka consumer is enabled. By default is `false`.
* **kafka.host**: Kafka host. By default `127.0.0.1`.
* **kafka.port**: Kafka port. By default `9092`.
* **securityContext.runAsUser**: user which run the app in container. By default `1001`.
* **replicaCount**: number of replicas for the app. By default `1`.
* **image.repository**: app image name. By default `amartinm82/tfm-users`.
* **image.tag**: app image tag. By default `latest`.
* **service.type**: app service type. By default `ClusterIP`.
* **service.port**: app port. By default `3443`.
* **resources.requests.memory**: app instance requested memory. By default `64Mi`.
* **resources.requests.cpu**: app instance requested cpu. By default `250m`.
* **resources.limits.memory**: app instance limit memory. By default `128Mi`.
* **resources.limits.cpu**: app instance requested cpu. By default `500m`.

## Usage

### Installation
To install project dependencies execute:
  ```sh
  $ npm install
  ```
### Run tests
To run tests execute:
* Unit tests:
  ```
  npm run unit:test
  ```
* Integration tests:
  ```
  npm run it:test
  ```
* All tests:
  ```
  npm test
  ```

### Run application

#### Locally
To run application locally:
1. Up necessary services:
   ```
   docker-compose -f docker-compose-dev.yml up
   ```
   Note: to stop services when they are not necessary run:
   ```
   docker-compose -f docker-compose-dev.yml down
   ```
2. Execute the app:
   ```
   npm start
   ```
   
   **Note:** To automatically restart app when some changes are made, then run next command instead of previous one:
    ```
    npm run dev
    ```

#### As docker container
To run application in a docker container execute:
```
npm run dockerize
```
Note: to stop application in container when not necessary then run:
```
docker-compose down
```

#### Checking application is running
In both cases, [locally](#locally) and [As docker container](#as-docker-container) you can use [openapi definition](./apis/rest/openapi-v1.yml) or [Postman collection](./postman/users%20API.postman_collection.json) to test running application.

* **Openapi**: open `openapi-v1.yml` content in [swagger editor](https://editor.swagger.io/) and select `localhost` server and execute endpoints you want.
* **Postman**: select `TFM-local-env` environment variable. Execute postman collection:
  * **Manually**: Set values you want in the endpoint body and run it.
  * **Automatically**: Set values to `userUsername` and `adminUsername` variables, and execute [Postman Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/).

**NOTE:** If the containers are not accessible via localhost, it will be necessary to use ${DOCKER_HOST_IP} instead of localhost. To do this, give a value to the variable:
```
export DOCKER_HOST_IP=127.0.0.1
```
For Mac:
```
sudo ifconfig lo0 alias 10.200.10.1/24  # (where 10.200.10.1 is some unused IP address)
export DOCKER_HOST_IP=10.200.10.1
```

## Contributing
To contribute to this project have in mind:
1. It was developed using [TBD](https://trunkbaseddevelopment.com/), so only main branch exists, and is necessary that every code pushed to remote repository is ready to be deployed in production environment.
2. In order to ensure the right style and code conventions, and that code to commit and push is ok, this project use __pre-commit and pre-push git hooks__. This is implemented using [husky](https://typicode.github.io/husky/#/).
Exists a [.husky](.husky) folder in project that contains the script to be executed in each hook.
   * **pre-commit:** This hook run eslint and unit tests, and if fails, changes can't be commited.
   * **pre-push:** This hook launch integration tests, and in case of failure, commits won't be pushed to remote branch. In case of is a tag push, it doesn't launch tests, instead it check that the tag match with the package.json version.
3. The API First approach was used, so please, if is necessary to modify API, in first place you must modify and validate [openapi definition](./apis/rest/openapi-v1.yml), and later, perform the code changes.
4. Every code you modify or add must have a test that check the right behaviour of it (As a future task we'll add sonar to ensure there is a minimum coverage).

## Deployment
This project has two available environments:
* Preproduction (PRE): Used to test the application previously to release it in a productive environment. This environment is accessible via API Gateway in the URL https://apigw-tfm-dev-amartinm82.cloud.okteto.net.
* Production (PRO): productive environment. Accesible in URL https://apigw-tfm-amartinm82.cloud.okteto.net.

The mechanism used to deploy the application in any of the previous environment is via github actions, that are defined in workflows in folder [.github/workflows](.github/workflows).
### PRE
When a push is done on remote branch (or a PR), github actions jobs defined in [ci-cd.yml](.github/workflows/ci-cd.yml) will be fired. All the jobs depends o the previous one, so if one of them fails, the project won't be deployed in the PRE environment:
   * **eslint**: Analyzes source code in the branch, if exists style errors fails.
   * **tests**: Run unitary and integration tests in the branch.
   * **publish-image**: Publish Docker image `tfm-users` with tag `trunk` in [Dockerhub](https://hub.docker.com/).
   * **deploy**: Deploy the previous generated image in PRE k8s cluster. For this, it uses the helm chart defined in [helm/charts](./helm/charts/) folder.

So, when we push in the main branch, because of the action execution, it results in if our code is right formatted, and works because it pass the tests, it is deployed and running on a k8s cluster of PRE environment.

As a note, in PRE environment, helm chart variables are passed to create a MYSQL container with persistent volume that can't be removed.

### PRO
#### Generate and deploy a new release
To deploy in PRO environment is necessary to generate a new release. To do that, execute:
```
npm run release
```    
It will tag the soure code with the current version of [package.json](./package.json), and push tag in remote repository.

Due to the new tag is pushed, the workflow defined in [release.yml](.github/workflows/release.yml) is executed. It has several jobs:
  * **check-tag**: Verifies if pushed tag match with package version.
  * **publish-package**: Depends on previous job. Publish npm package version in github packages repository.
  * **publish-release**: Depends on previous job. Publish the release in github.
  * **publish-image**: Depends on previous job. Generate docker image of app, tagging it with `latest` and  `{pushed_tag}` (i.e: if we generated the tag 1.2.0. it tag the new image with 1.2.0), and publishing them in [Dockerhub](https://hub.docker.com/).
  * **deploy**: Depends on previous job. It deploys application in PRO k8s cluster using `{pushed_tag}` image. For this, it uses the helm chart defined in [helm/charts](./helm/charts/) folder.
  *  **bump-version**: It depends on `publish-release` job, so is executed parallelly with `publish-release`. It increments the package version and update the remote repository, to avoid version conflicts during the development.

#### Deploy existing release
To deploy an existing release you can execute in github manual workflow defined in [manual-release-deploy.yml](.github/workflows/manual-release-deploy.yml).
Select main branch (the only one that exists), and introduce the release to deploy in the input. The release will be deployed in PRO environment.

As a note, in PRO environment, helm chart is called with `mysql.create` disabled, so a MySQL container is not created, and application point againts a MYSQL instance.

### Checking application is deployed
Like in [Usage > Run application > Checking application is running](#checking-application-is-running) you can check if the application is successfully deployed using Openapi definition or Postman collection. 
* **Openapi**: open `openapi-v1.yml` content in [swagger editor](https://editor.swagger.io/) and select https://apigw-tfm-dev-amartinm82.cloud.okteto.net or https://apigw-tfm-amartinm82.cloud.okteto.net server and execute endpoints you want.
* **Postman**: select `TFM-pre-env` or `TFM-pro-env` environment variable. Execute postman collection as described in [Usage > Run application > Checking application is running](#checking-application-is-running).
  
## Developers
This project was developed by:

👤 [Álvaro Martín](https://github.com/amartinm82) - :incoming_envelope: [amartinm82@gmail.com](amartinm82@gmail.com)
