const config = require('../config/config');
const consumerService = require('./services/consumerService');
const { getConsumer } = require('./kafka');

let consumer;

const validateBalanceTopic = config['kafka.topics.validateBalance'];

const listen = async () => {
  if (!config['kafka.enabled']) {
    return;
  }
  try {
    console.log('Connecting to broker.');
    consumer = getConsumer();
    await consumer.connect();
    await consumer.subscribe({ topic: validateBalanceTopic });
    await consumer.run({
      eachMessage: async ({ message }) => {
        consumerService.consumeValidateBalanceEvent(message);
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const disconnect = async () => {
  if (!config['kafka.enabled']) {
    return;
  }
  console.log('Disconnecting from broker');
  if (consumer) {
    await consumer.disconnect();
  }
};

module.exports = {
  listen,
  disconnect,
};
