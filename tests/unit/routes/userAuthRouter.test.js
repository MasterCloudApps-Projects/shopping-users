const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../../src/app');
const userService = require('../../../src/services/userService');
const UserResponseWithPasswordDto = require('../../../src/dtos/userResponseWithPasswordDto');

const request = supertest(app);

jest.mock('../../../src/services/userService.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userAuthRouter POST /api/v1/auth tests', () => {
  const POST_URL = '/api/v1/auth';
  const INVALID_CREDENTIALS_MSG = 'Invalid credentials.';

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

  test('Given a request with not existing username When userService return null user Then should return unauthorized response', () => {
    userService.getByUsername.mockResolvedValue(null);

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.error).toBe(INVALID_CREDENTIALS_MSG);
      });
  });

  test('Given a request with incorrect password When userService return user but password does not match Then should return unauthorized response', () => {
    const user = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
      balance: 0.0,
    };

    userService.getByUsername.mockResolvedValue(user);
    bcrypt.compareSync.mockReturnValue(false);

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'BadP4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.error).toBe(INVALID_CREDENTIALS_MSG);
      });
  });

  test('Given a request with valid username and password When userService return user and password match Then should return created response', () => {
    const user = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
      balance: 0.0,
    };

    userService.getByUsername.mockResolvedValue(
      new UserResponseWithPasswordDto(user.id, user.username, user.password),
    );

    bcrypt.compareSync.mockReturnValue(true);

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVJfUk9MRSIsImlhdCI6MTYzNzM0NTg5OSwiZXhwIjoxNjM3MzQ2MTk5fQ.qnkOMsfHA2YDni_WlgV7yPbEySomqKCkLK8G4t4IeUI';
    jwt.sign.mockReturnValue(token);

    return request
      .post(POST_URL)
      .send({
        username: 'user@email.com',
        password: 'P4ssword',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.token).toBe(token);
      });
  });

  test('Given a request with valid username and password When userService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';

    userService.getByUsername.mockImplementation(() => {
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
});
