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
To run application in local:
1. Up database:
   ```
   docker run --rm -p 3306:3306 --name mysql-db -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=users -e -d mysql:latest
   ```
2. Install dependencies:
    ```
    npm install
    ```
3. Execute the app:
   ```
   npm start
   ```
   
   Note: To run in development mode run next command instead of previous one:
    ```
    npm run dev
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