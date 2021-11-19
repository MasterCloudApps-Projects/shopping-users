const supertest = require('supertest');
const app = require('../../../src/app');
const userService = require('../../../src/services/userService');
const UserResponseDto = require('../../../src/dtos/userResponseDto');
const verifyToken = require('../../../src/middlewares/authMiddleware');

const request = supertest(app);

jest.mock('../../../src/services/userService.js');
jest.mock('../../../src/middlewares/authMiddleware');

const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVJfUk9MRSIsImlhdCI6MTYzNzM0NTg5OSwiZXhwIjoxNjM3MzQ2MTk5fQ.qnkOMsfHA2YDni_WlgV7yPbEySomqKCkLK8G4t4IeUI';

describe('userRouter POST /api/v1/users tests', () => {
  const POST_URL = '/api/v1/users';

  test('Given a request with invalid body When post Then should return bad request response', () => request
    .post(POST_URL)
    .send({
      username: 'invalidUsername',
      password: 'P4ssword',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
      expect(response.body.error).toBe('Username must be a valid email');
    }));

  test('Given a request with valid body When post and userService return null created user Then should return conflict response', () => {
    userService.create.mockResolvedValue(null);

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)
      .then((response) => {
        expect(response.body.error).toBe('Already exists an user with that username');
      });
  });

  test('Given a request with valid body When post and userService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';

    userService.create.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBe(errorMessage);
      });
  });

  test('Given a request with valid body When post and userService return created user Then should return created response', () => {
    const user = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
      balance: 0.0,
    };

    userService.create.mockResolvedValue(new UserResponseDto(user.id, user.username, user.balance));

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.headers['Location'.toLowerCase()]).toBe(`${response.request.url}/${user.id}`);
        expect(response.body.id).toBe(user.id);
      });
  });
});

describe('userRouter GET /api/v1/users/:id tests', () => {
  const GET_URL = '/api/v1/users/';
  const USER_ID = 1;

  verifyToken.mockImplementation((req, res, next) => {
    req.userId = USER_ID;
    req.role = 'USER_ROLE';
    return next();
  });

  test('Given an user role with param id different of authorized userId When get Then should return forbidden response', () => request
    .get(GET_URL + 0)
    .set('Authorization', BEARER_TOKEN)
    .expect('Content-Type', /json/)
    .expect(403)
    .then((response) => {
      expect(response.body.error).toBe('You don\'t have permission to access the resource');
    }));

  test('Given a not existing id When get Then should return not found response', () => {
    userService.getById.mockResolvedValue(null);

    return request
      .get(GET_URL + USER_ID)
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe('User not found');
      });
  });

  test('Given a existing id When get Then should return user', () => {
    const userResponseDto = new UserResponseDto(USER_ID, 'username@mail.com', 12.56);
    userService.getById.mockResolvedValue(userResponseDto);

    return request
      .get(GET_URL + USER_ID)
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(userResponseDto.id);
        expect(response.body.username).toBe(userResponseDto.username);
        expect(response.body.balance).toBe(userResponseDto.balance);
      });
  });

  test('Given a existing id When get and userService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';
    userService.getById.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    return request
      .get(GET_URL + USER_ID)
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBe(errorMessage);
      });
  });
});

describe('userRouter POST /api/v1/users/:id/balance tests', () => {
  const BASE_URL = '/api/v1/users/';
  const USER_ID = 1;
  const BALANCE_SUFFIX = '/balance';

  test('Given a request with amount less than 0 When add balance Then should return bad request response', () => request
    .post(`${BASE_URL + USER_ID + BALANCE_SUFFIX}`)
    .send({ amount: -0.01 })
    .set('Authorization', BEARER_TOKEN)
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
      expect(response.body.error).toBe('Amount to add must be greater than 0');
    }));

  test('Given a request with amount equals to 0 When add balance Then should return bad request response', () => request
    .post(`${BASE_URL + USER_ID + BALANCE_SUFFIX}`)
    .send({ amount: 0 })
    .set('Authorization', BEARER_TOKEN)
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
      expect(response.body.error).toBe('Amount to add must be greater than 0');
    }));

  test('Given a request with amount greater than 0 When add balance Then should return user with added amount to balance', () => {
    const userResponseDto = new UserResponseDto(USER_ID, 'username@mail.com', 12.56);
    userService.addBalance.mockResolvedValue(userResponseDto);
    return request
      .post(`${BASE_URL + USER_ID + BALANCE_SUFFIX}`)
      .send({ amount: 0.01 })
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(userResponseDto.id);
        expect(response.body.username).toBe(userResponseDto.username);
        expect(response.body.balance).toBe(userResponseDto.balance);
      });
  });

  test('Given a request with amount greater than 0 When add balance and don\'t find user Then should return not found response', () => {
    userService.addBalance.mockResolvedValue(null);
    return request
      .post(`${BASE_URL + USER_ID + BALANCE_SUFFIX}`)
      .send({ amount: 0.01 })
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe('User not found');
      });
  });

  test('Given a request with amount greater than 0 When add balance and userService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';
    userService.addBalance.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    return request
      .post(`${BASE_URL + USER_ID + BALANCE_SUFFIX}`)
      .send({ amount: 0.01 })
      .set('Authorization', BEARER_TOKEN)
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBe(errorMessage);
      });
  });
});
