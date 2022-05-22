/* eslint-disable no-underscore-dangle */
process.env.RDS_PORT = global.__TESTCONTAINERS_MYSQL_PORT_3306__;
/* eslint-enable no-underscore-dangle */
const supertest = require('supertest');
const { KafkaContainer } = require('testcontainers');
const app = require('../../src/app');
const database = require('../../src/database');
const config = require('../../config/config');
const { getProducer, getKafkaClient } = require('../../src/kafka');
const broker = require('../../src/broker');

const request = supertest(app);

let kafkaContainer;
let producer;
let spy;

const validateBalanceTopic = config['kafka.topics.validateBalance'];
const changeStateTopic = config['kafka.topics.changeState'];

jest.setTimeout(240000);

const BASE_URL = '/api/v1/users';
const AUTH_URL = '/api/v1/auth';
const BALANCE_SUFFIX = '/balance';
const WAIT_TIME = 10;

beforeAll(async () => {
  kafkaContainer = await new KafkaContainer().withExposedPorts(9093).start();

  config['kafka.enabled'] = process.env.KAFKA_ENABLED || true;
  config['kafka.host'] = process.env.KAFKA_HOST || kafkaContainer.getHost();
  config['kafka.port'] = process.env.KAFKA_PORT || kafkaContainer.getMappedPort(9093);

  await database.connect();

  const admin = getKafkaClient().admin();
  await admin.connect();
  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: validateBalanceTopic, numPartitions: 1, replicationFactor: 1 },
      { topic: changeStateTopic, numPartitions: 1, replicationFactor: 1 },
    ],
  });

  producer = getProducer();
  await producer.connect();

  spy = jest.spyOn(producer, 'send');

  await broker.listen();
});

afterAll(async () => {
  spy.mockRestore();
  await producer.disconnect();
  await broker.disconnect();
  await kafkaContainer.stop();
  database.disconnect();
});

const sleep = async (seconds) => new Promise((resolve) => {
  setTimeout(resolve, (seconds * 1000));
});

async function sendEvent(topic, message) {
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
}

describe('Broker tests', () => {
  it('Given an existing user with enough balance When consume validate balance event Then should update user balance and send change order state event with success state', async () => {
    let createdUserId;
    let token;
    const userRequestDto = { username: 'user1@email.com', password: 'P4ssword' };
    await request.post(BASE_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        createdUserId = response.body.id;
      });
    await request.post(AUTH_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    await request
      .post(`${BASE_URL}/${createdUserId}${BALANCE_SUFFIX}`)
      .send({ amount: 19.99 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(19.99);
      });

    const validateItemsMsg = {
      id: 1652692351138,
      shoppingCart: {
        id: 1652692327498,
        userId: createdUserId,
        completed: true,
        items: [
          {
            productId: 1,
            unitPrice: 19.99,
            quantity: 1,
            totalPrice: 19.99,
          },
        ],
        totalPrice: 19.99,
      },
      successState: 'DONE',
      failureState: 'REJECTED',
    };

    await sendEvent(validateBalanceTopic, validateItemsMsg);

    await sleep(WAIT_TIME);

    await expect(spy).toHaveBeenLastCalledWith(
      {
        topic: changeStateTopic,
        messages: [
          {
            value: JSON.stringify({
              id: validateItemsMsg.id,
              state: validateItemsMsg.successState,
            }),
          },
        ],
      },
    );

    return request
      .get(`${BASE_URL}/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(0.0);
      });
  });

  it('Given an existing user without enough balance When consume validate balance event Then should not update user balance and send change order state event with failure state', async () => {
    let createdUserId;
    let token;
    const userRequestDto = { username: 'user2@email.com', password: 'P4ssword' };
    await request.post(BASE_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        createdUserId = response.body.id;
      });
    await request.post(AUTH_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    await request
      .post(`${BASE_URL}/${createdUserId}${BALANCE_SUFFIX}`)
      .send({ amount: 19.98 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(19.98);
      });

    const validateItemsMsg = {
      id: 1652692351138,
      shoppingCart: {
        id: 1652692327498,
        userId: createdUserId,
        completed: true,
        items: [
          {
            productId: 1,
            unitPrice: 19.99,
            quantity: 1,
            totalPrice: 19.99,
          },
        ],
        totalPrice: 19.99,
      },
      successState: 'DONE',
      failureState: 'REJECTED',
    };

    await sendEvent(validateBalanceTopic, validateItemsMsg);

    await sleep(WAIT_TIME);

    await expect(spy).toHaveBeenLastCalledWith(
      {
        topic: changeStateTopic,
        messages: [
          {
            value: JSON.stringify({
              id: validateItemsMsg.id,
              state: validateItemsMsg.failureState,
              errors: [`Shopping cart price is ${validateItemsMsg.shoppingCart.totalPrice}, but user only has 19.98 available`],
            }),
          },
        ],
      },
    );

    return request
      .get(`${BASE_URL}/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(19.98);
      });
  });

  it('Given non existing user When consume validate balance event Then should send change order state event with failure state', async () => {
    const validateItemsMsg = {
      id: 1652692351138,
      shoppingCart: {
        id: 1652692327498,
        userId: 9999,
        completed: true,
        items: [
          {
            productId: 1,
            unitPrice: 19.99,
            quantity: 1,
            totalPrice: 19.99,
          },
        ],
        totalPrice: 19.99,
      },
      successState: 'DONE',
      failureState: 'REJECTED',
    };

    await sendEvent(validateBalanceTopic, validateItemsMsg);

    await sleep(WAIT_TIME);

    return expect(spy).toHaveBeenLastCalledWith(
      {
        topic: changeStateTopic,
        messages: [
          {
            value: JSON.stringify({
              id: validateItemsMsg.id,
              state: validateItemsMsg.failureState,
              errors: [`User with id ${validateItemsMsg.shoppingCart.userId} not found`],
            }),
          },
        ],
      },
    );
  });
});
