const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

let sequelize;

function getSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize(config['db.db_name'], config['db.user'], config['db.password'], {
      host: config['db.host'],
      port: config['db.port'],
      dialect: 'mysql'
    });
  }
  return sequelize;
}

function connect() {

  sequelize = getSequelize();

  return sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully');
      sequelize.sync()
        .then(() => console.log("All models were synchronized successfully."));
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

}

function disconnect() {
  return sequelize.close()
    .then(console.log("Closed database connection"))
    .catch((err) => {
      console.error("Error closing connection to database: ", err);
    });
}

module.exports = { getSequelize, connect, disconnect }