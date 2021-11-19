/* eslint-disable no-underscore-dangle */
process.env.RDS_PORT = global.__TESTCONTAINERS_MYSQL_PORT_3306__;
/* eslint-enable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database');

const request = supertest(app);

const BASE_URL = '/api/v1/admins';

beforeAll(async () => {
  await database.connect();
});

afterAll(() => {
  database.disconnect();
});

describe('adminRouter POST /api/v1/admins tests', () => {
  it('Given 2 admins with same username When post admins Then should create first and return an error for the second', async () => {
    const userRequest = {
      username: 'user58@email.com',
      password: 'P4ssword',
    };
    await request.post(BASE_URL)
      .send(userRequest)
      .set('Accept', 'application/json')
      .expect(201);
    return request.post(BASE_URL)
      .send(userRequest)
      .expect(409)
      .then((response) => {
        expect(response.body.error).toBe('Already exists an admin with that username');
      });
  });
});
