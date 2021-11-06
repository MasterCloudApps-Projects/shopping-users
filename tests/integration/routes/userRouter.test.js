/* eslint-disable no-underscore-dangle */
process.env.RDS_PORT = global.__TESTCONTAINERS_MYSQL_PORT_3306__;
/* eslint-enable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database');

const request = supertest(app);

describe('testcontainers example suite', () => {
  const POST_URL = '/api/v1/users';

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(() => {
    database.disconnect();
  });

  it('Given 2 users with same username When post users Then should create first and return an error for the second', async () => {
    const userRequest = {
      username: 'user58@email.com',
      password: 'P4ssword',
    };
    await request.post(POST_URL)
      .send(userRequest)
      .set('Accept', 'application/json')
      .expect(201);
    return request.post(POST_URL)
      .send(userRequest)
      .expect(409)
      .then((response) => {
        expect(response.body.error).toBe('Already exists a user with that username');
      });
  });
});
