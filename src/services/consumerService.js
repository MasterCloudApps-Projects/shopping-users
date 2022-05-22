const userService = require('./userService');
const config = require('../../config/config');

const { getProducer } = require('../kafka');

async function sendEvent(message) {
  const producer = getProducer();
  await producer.connect();
  await producer.send({
    topic: config['kafka.topics.changeState'],
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
  console.log(`Sent message ${JSON.stringify(message)} to topic ${config['kafka.topics.changeState']}`);
}

async function consumeValidateBalanceEvent(message) {
  try {
    console.log(`Received message ${message.value}`);
    const orderValidationRequestedEvent = JSON.parse(message.value);
    console.log(`orderValidationRequestedEvent ${orderValidationRequestedEvent}`);

    const orderUpdateRequestedEvent = {
      id: orderValidationRequestedEvent.id,
    };

    let errorMessage = null;
    let user = await userService.getById(orderValidationRequestedEvent.shoppingCart.userId);
    if (!user) {
      errorMessage = `User with id ${orderValidationRequestedEvent.shoppingCart.userId} not found`;
      console.error(errorMessage);
      console.error(`Order ${orderValidationRequestedEvent.id} must be rejected`);
      orderUpdateRequestedEvent.state = orderValidationRequestedEvent.failureState;
      orderUpdateRequestedEvent.errors = [errorMessage];
    } else if (user.balance < orderValidationRequestedEvent.shoppingCart.totalPrice) {
      errorMessage = `Shopping cart price is ${orderValidationRequestedEvent.shoppingCart.totalPrice}, but user only has ${user.balance} available`;
      console.error(errorMessage);
      orderUpdateRequestedEvent.state = orderValidationRequestedEvent.failureState;
      orderUpdateRequestedEvent.errors = [errorMessage];
    } else {
      console.log(`Valid user balance for order ${orderValidationRequestedEvent.id}`);
      user = await userService
        .addBalance(user.id, -orderValidationRequestedEvent.shoppingCart.totalPrice);
      console.log(`User ${user.id} balance updated to ${user.balance}`);
      orderUpdateRequestedEvent.state = orderValidationRequestedEvent.successState;
    }
    await sendEvent(orderUpdateRequestedEvent);
  } catch (error) {
    console.error(`Error processing message ${message.value}`, error);
  }
}

module.exports = {
  consumeValidateBalanceEvent,
};
