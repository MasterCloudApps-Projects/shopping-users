/* eslint-disable no-underscore-dangle */
process.env.RDS_PORT = global.__TESTCONTAINERS_MYSQL_PORT_3306__;
/* eslint-enable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database');

const request = supertest(app);

describe('authRouter POST /api/v1/auth tests', () => {
  const POST_URL = '/api/v1/auth';
  const INVALID_CREDENTIALS_MSG = 'Invalid credentials.';
  const USERS_POST_URL = '/api/v1/users';

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(() => {
    database.disconnect();
  });

  it('Given not existing username When auth Then should return unauthorized', async () => {
    const userRequest = {
      username: 'user1@email.com',
      password: 'P4ssword',
    };
    return request.post(POST_URL)
      .send(userRequest)
      .expect(401)
      .then((response) => {
        expect(response.body.error).toBe(INVALID_CREDENTIALS_MSG);
      });
  });

  it('Given a user creation When auth with wrong password Then should return unauthorized', async () => {
    const userRequest = {
      username: 'user2@email.com',
      password: 'P4ssword',
    };
    await request.post(USERS_POST_URL)
      .send(userRequest)
      .set('Accept', 'application/json')
      .expect(201);
    return request.post(POST_URL)
      .send({
        username: userRequest.username,
        password: 'BadP4ssword',
      })
      .expect(401)
      .then((response) => {
        expect(response.body.error).toBe(INVALID_CREDENTIALS_MSG);
      });
  });

  it('Given a user creation When auth with him Then should return token', async () => {
    const userRequest = {
      username: 'user3@email.com',
      password: 'P4ssword',
    };
    await request.post(USERS_POST_URL)
      .send(userRequest)
      .set('Accept', 'application/json')
      .expect(201);
    return request.post(POST_URL)
      .send(userRequest)
      .expect(200)
      .then((response) => {
        expect(response.body.token).not.toBeNull();
      });
  });
});
