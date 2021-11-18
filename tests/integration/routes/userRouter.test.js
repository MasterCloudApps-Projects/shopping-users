/* eslint-disable no-underscore-dangle */
process.env.RDS_PORT = global.__TESTCONTAINERS_MYSQL_PORT_3306__;
/* eslint-enable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../../../src/app');
const database = require('../../../src/database');
const UserRequestDto = require('../../../src/dtos/userRequestDto');

const request = supertest(app);

const BASE_URL = '/api/v1/users';
const AUTH_URL = '/api/v1/auth';

beforeAll(async () => {
  await database.connect();
});

afterAll(() => {
  database.disconnect();
});

describe('userRouter POST /api/v1/users tests', () => {
  it('Given 2 users with same username When post users Then should create first and return an error for the second', async () => {
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
        expect(response.body.error).toBe('Already exists a user with that username');
      });
  });
});

describe('userRouter GET /api/v1/users/:id tests', () => {
  it('Given a request without authorization header When get user by id Then should return an unauthorized error', async () => request
    .get(`${BASE_URL}/${0}`)
    .expect(401)
    .then((response) => {
      expect(response.body.error).toBe('No token provided.');
    }));

  it('Given a request with invalid authorization token When get user by id Then should return a forbidden error', async () => request
    .get(`${BASE_URL}/${0}`)
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
    .expect(403)
    .then((response) => {
      expect(response.body.error).toBe('Invalid or expired token.');
    }));

  it('Given an authenticated user When try to get other user info Then should return a forbidden error', async () => {
    let firstUserId;
    let token;
    await request.post(BASE_URL)
      .send({
        username: 'user111@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        firstUserId = response.body.id;
      });
    await request.post(BASE_URL)
      .send({
        username: 'user112@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(201);
    await request.post(AUTH_URL)
      .send({
        username: 'user112@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    return request
      .get(`${BASE_URL}/${firstUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .then((response) => {
        expect(response.body.error).toBe('You don\'t have permission to access the resource');
      });
  });

  it('Given an created user authenticated When get Then should return user info', async () => {
    let userId;
    let token;
    const userRequestDto = new UserRequestDto('user200@email.com', 'P4ssword');
    await request.post(BASE_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        userId = response.body.id;
      });
    await request.post(AUTH_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    return request
      .get(`${BASE_URL}/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(userId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(0.0);
      });
  });
});

describe('userRouter POST /api/v1/users/:id/balance tests', () => {
  const BALANCE_SUFFIX = '/balance';

  it('Given a request without authorization header When add balance to a user Then should return an unauthorized error', async () => request
    .post(`${BASE_URL}/${0}${BALANCE_SUFFIX}`)
    .send({ amount: 0.01 })
    .expect(401)
    .then((response) => {
      expect(response.body.error).toBe('No token provided.');
    }));

  it('Given a request with invalid token When add balance to a user Then should return a forbidden error', async () => request
    .post(`${BASE_URL}/${0}${BALANCE_SUFFIX}`)
    .send({ amount: 0.01 })
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
    .expect(403)
    .then((response) => {
      expect(response.body.error).toBe('Invalid or expired token.');
    }));

  it('Given an authenticated user When try to add balance to other user Then should return a forbidden error', async () => {
    let firstUserId;
    let token;
    await request.post(BASE_URL)
      .send({
        username: 'user333@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        firstUserId = response.body.id;
      });
    await request.post(BASE_URL)
      .send({
        username: 'user334@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(201);
    await request.post(AUTH_URL)
      .send({
        username: 'user334@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    return request
      .post(`${BASE_URL}/${firstUserId}${BALANCE_SUFFIX}`)
      .send({ amount: 0.01 })
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .then((response) => {
        expect(response.body.error).toBe('You don\'t have permission to access the resource');
      });
  });

  it('Given an created user authenticated When add balance Then should return user info with balance updated', async () => {
    let userId;
    let token;
    const userRequestDto = new UserRequestDto('user444@email.com', 'P4ssword');
    await request.post(BASE_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        userId = response.body.id;
      });
    await request.post(AUTH_URL)
      .send(userRequestDto)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        token = response.body.token;
      });
    return request
      .post(`${BASE_URL}/${userId}${BALANCE_SUFFIX}`)
      .send({ amount: 0.01 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(userId);
        expect(response.body.username).toBe(userRequestDto.username);
        expect(response.body.balance).toBe(0.01);
      });
  });
});
