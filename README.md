# Master cloud apps TFM - Users microservice

## Description
This service provides:
1. An API Rest that allows users managing:
   * Create user.
   * Authenticate.
   * Get user detail.
   * Add money to the user's balance.

## Technologies
To implement this service next technologies are used:
* nodejs with next dependencies:
   * express
   * bcryptjs
   * mysql2
   * sequelize
* MySQL database

## CI/CD
### Git hoooks
In order to ensure the right style and code conventions, and that code to commit and push is ok, this project use pre-commit and pre-push git hooks. This is implemented using [husky](https://typicode.github.io/husky/#/).
Exists a [.husky](.husky) folder in project that contains the script to be executed in each hook.
* **pre-commit:** This hook run eslint and unit tests, and if fails, changes can't be commited.
* **pre-push:** This hook launch integration tests, and in case of failure, commits won't be pushed to remote branch. 

### Github actions
Furthermore, when a push is done on remote branch, github actions jobs will be fired. These actions are defined in [.github/workflows](.github/workflows) folder.
* ci-cd: defines jobs to execute when a push (or a PR) is done in the branch. In this case only exist one job composed of the next steps. All the jobs depends o the previous one, so if one of them fails, the project won't be deployed in the PRE environment:
   * eslint: Analyzes source code in the branch, if exists style errors.
   * tests: Run unitary and integration tests in the branch.
   * publish-image: Publish Docker image __tfm-users__ with tag __trunk__ in [Dockerhub](https://hub.docker.com/).
   * deploy: Deploy the previous generated image in k8s cluster. For this, it uses the helm chart defined in [helm/charts](hel/../helm/charts/) folder.

So, when we push in the main branch, because of the action execution, it results in if our code is right formatted, and works because it pass the tests, it is deployed and running on a k8s cluster.

## Usage
### Run application

#### Development mode
To run application in local for development purposes:
1. Up necessary services:
   ```
   docker-compose -f docker-compose-dev.yml up
   ```
2. Install dependencies:
    ```
    npm install
    ```
3. Execute the app:
   ```
   npm start
   ```
   
   **Note:** To automatically restart app when some changes are made, then run next command instead of previous one:
    ```
    npm run dev
    ```

#### Deploy
To deploy application in containers execute:
```bash
docker-compose up
```

### Run tests
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