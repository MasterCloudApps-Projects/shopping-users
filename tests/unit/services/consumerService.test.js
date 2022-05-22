const userService = require('../../../src/services/userService');
const kafka = require('../../../src/kafka');
const consumerService = require('../../../src/services/consumerService');
const config = require('../../../config/config');

jest.mock('../../../src/services/userService.js');
jest.mock('../../../src/kafka');

const producer = {};
producer.connect = jest.fn();
producer.send = jest.fn();
kafka.getProducer.mockReturnValue(producer);

beforeEach(() => {
  userService.getById.mockClear();
  producer.send.mockClear();
  userService.addBalance.mockClear();
});

describe('consumerService consumeValidateBalanceEvent function tests', () => {
  const message = {
    id: 1652692351138,
    shoppingCart: {
      id: 1652692327498,
      userId: 1,
      completed: true,
      items: [
        {
          productId: 1,
          unitPrice: 19.99,
          quantity: 1,
          totalPrice: 19.99,
        },
        {
          productId: 2,
          unitPrice: 12.5,
          quantity: 2,
          totalPrice: 25.0,
        },
      ],
      totalPrice: 44.99,
    },
    successState: 'DONE',
    failureState: 'REJECTED',
  };

  test('Given an event with non existing user When consume validate balance event Then should send event with failure state', () => {
    userService.getById.mockReturnValue(null);

    const orderUpdateRequestedEvent = {
      id: message.id,
      state: message.failureState,
      errors: ['User with id 1 not found'],
    };

    return consumerService.consumeValidateBalanceEvent({ value: JSON.stringify(message) })
      .then(() => {
        expect(userService.getById.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(kafka.getProducer().send.mock.calls[0][0].topic).toBe(config['kafka.topics.changeState']);
        expect(kafka.getProducer().send.mock.calls[0][0].messages.length).toBe(1);
        expect(kafka.getProducer().send.mock.calls[0][0].messages[0].value)
          .toBe(JSON.stringify(orderUpdateRequestedEvent));
        expect(userService.addBalance.mock.calls.length).toBe(0);
      });
  });

  test('Given an event with total price higher than user balance When consume validate balance event Then should not update user balance and send event with failure state', () => {
    const user = {
      id: message.shoppingCart.userId,
      username: 'username',
      balance: 1.0,
    };
    userService.getById.mockReturnValue(user);

    const orderUpdateRequestedEvent = {
      id: message.id,
      state: message.failureState,
      errors: [`Shopping cart price is ${message.shoppingCart.totalPrice}, but user only has ${user.balance} available`],
    };

    return consumerService.consumeValidateBalanceEvent({ value: JSON.stringify(message) })
      .then(() => {
        expect(userService.getById.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(kafka.getProducer().send.mock.calls[0][0].topic).toBe(config['kafka.topics.changeState']);
        expect(kafka.getProducer().send.mock.calls[0][0].messages.length).toBe(1);
        expect(kafka.getProducer().send.mock.calls[0][0].messages[0].value)
          .toBe(JSON.stringify(orderUpdateRequestedEvent));
        expect(userService.addBalance.mock.calls.length).toBe(0);
      });
  });

  test('Given an event with shopping cart price equals to user balance When consume validate balance event Then should update user balance and send event with success state', () => {
    const user = {
      id: message.shoppingCart.userId,
      username: 'username',
      balance: message.shoppingCart.totalPrice,
    };
    userService.getById.mockReturnValue(user);
    userService.addBalance.mockReturnValue({
      id: message.shoppingCart.userId,
      username: 'username',
      balance: 0.0,
    });

    const orderUpdateRequestedEvent = {
      id: message.id,
      state: message.successState,
    };

    return consumerService.consumeValidateBalanceEvent({ value: JSON.stringify(message) })
      .then(() => {
        expect(userService.getById.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(kafka.getProducer().send.mock.calls[0][0].topic).toBe(config['kafka.topics.changeState']);
        expect(kafka.getProducer().send.mock.calls[0][0].messages.length).toBe(1);
        expect(kafka.getProducer().send.mock.calls[0][0].messages[0].value)
          .toBe(JSON.stringify(orderUpdateRequestedEvent));
        expect(userService.addBalance.mock.calls.length).toBe(1);
        expect(userService.addBalance.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(userService.addBalance.mock.calls[0][1])
          .toEqual({ amount: -message.shoppingCart.totalPrice });
      });
  });

  test('Given an event with shopping cart price less than user balance When consume validate balance event Then should update user balance and send event with success state', () => {
    const user = {
      id: message.shoppingCart.userId,
      username: 'username',
      balance: message.shoppingCart.totalPrice + 0.1,
    };
    userService.getById.mockReturnValue(user);
    userService.addBalance.mockReturnValue({
      id: message.shoppingCart.userId,
      username: 'username',
      balance: 0.1,
    });

    const orderUpdateRequestedEvent = {
      id: message.id,
      state: message.successState,
    };

    return consumerService.consumeValidateBalanceEvent({ value: JSON.stringify(message) })
      .then(() => {
        expect(userService.getById.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(kafka.getProducer().send.mock.calls[0][0].topic).toBe(config['kafka.topics.changeState']);
        expect(kafka.getProducer().send.mock.calls[0][0].messages.length).toBe(1);
        expect(kafka.getProducer().send.mock.calls[0][0].messages[0].value)
          .toBe(JSON.stringify(orderUpdateRequestedEvent));
        expect(userService.addBalance.mock.calls.length).toBe(1);
        expect(userService.addBalance.mock.calls[0][0]).toBe(message.shoppingCart.userId);
        expect(userService.addBalance.mock.calls[0][1])
          .toEqual({ amount: -message.shoppingCart.totalPrice });
      });
  });
});
