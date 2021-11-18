const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../../src/app');
const adminService = require('../../../src/services/adminService');
const UserResponseWithPasswordDto = require('../../../src/dtos/userResponseWithPasswordDto');

const request = supertest(app);

jest.mock('../../../src/services/adminService.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('adminAuthRouter POST /api/v1/admins/auth tests', () => {
  const POST_URL = '/api/v1/admins/auth';
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

  test('Given a request with not existing username When adminService return null admin Then should return unauthorized response', () => {
    adminService.getByUsername.mockResolvedValue(null);

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

  test('Given a request with incorrect password When adminService return admin but password does not match Then should return unauthorized response', () => {
    const admin = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
    };

    adminService.getByUsername.mockResolvedValue(admin);
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

  test('Given a request with valid username and password When adminService return admin and password match Then should return created response', () => {
    const admin = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
    };

    adminService.getByUsername.mockResolvedValue(
      new UserResponseWithPasswordDto(admin.id, admin.username, admin.password),
    );

    bcrypt.compareSync.mockReturnValue(true);

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOX1JPTEUiLCJpYXQiOjE2MzcyNjE4ODQsImV4cCI6MTYzNzI2MjE4NH0.M_7yTPeg7lZ5rBtU76xTKZx88uQgaKUhEPu07eWPrpY';
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
        expect(response.body.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOX1JPTEUiLCJpYXQiOjE2MzcyNjE4ODQsImV4cCI6MTYzNzI2MjE4NH0.M_7yTPeg7lZ5rBtU76xTKZx88uQgaKUhEPu07eWPrpY');
      });
  });

  test('Given a request with valid username and password When adminService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';

    adminService.getByUsername.mockImplementation(() => {
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
