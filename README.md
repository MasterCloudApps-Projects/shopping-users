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

## Run application
To run application in local:
1. Up database:
   ```
   running docker run --rm -p 3306:3306 --name mysql-db -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=users -e -d mysql:latest
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