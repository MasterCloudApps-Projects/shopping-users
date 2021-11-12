const { Sequelize } = require('sequelize');
const config = require('../config/config');

let sequelize;

function getSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize(config['db.db_name'], config['db.user'], config['db.password'], {
      host: config['db.host'],
      port: config['db.port'],
      dialect: 'mysql',
    });
  }
  return sequelize;
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* eslint-disable no-await-in-loop */
async function connect() {
  sequelize = getSequelize();

  let retries = 0;
  let isConnected = false;
  while (!isConnected && retries < config['db.connection.max_retries']) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      isConnected = true;
    } catch (error) {
      retries += 1;
      console.error('Unable to connect to the database:', error);
      if (retries === config['db.connection.max_retries']) {
        console.error('Max retries reached: ', config['db.connection.max_retries']);
        throw error;
      }
      console.error(`Waiting ${config['db.connection.retry-interval']} milliseconds to retry connection`);
      await timeout(config['db.connection.retry-interval']);
    }
  }
  await sequelize.sync();
  console.log('All models were synchronized successfully.');
}
/* eslint-enable no-await-in-loop */

function disconnect() {
  return sequelize.close()
    .then(console.log('Closed database connection'))
    .catch((err) => {
      console.error('Error closing connection to database: ', err);
    });
}

module.exports = { getSequelize, connect, disconnect };
