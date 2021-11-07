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

## CI
In order to ensure the right style and code conventions, and that code to commit and push is ok, a [husky](https://typicode.github.io/husky/#/) pre-commit hook is used. This hook run eslint and test, ann if fails, changes can't be commited.
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