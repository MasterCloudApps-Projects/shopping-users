const supertest = require('supertest');
const app = require('../../../src/app');
const adminService = require('../../../src/services/adminService');
const AdminResponseDto = require('../../../src/dtos/adminResponseDto');

const request = supertest(app);

jest.mock('../../../src/services/adminService.js');

describe('adminRouter POST /api/v1/admins tests', () => {
  const POST_URL = '/api/v1/admins';

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

  test('Given a request with valid body When post and adminService return null created admin Then should return conflict response', () => {
    adminService.create.mockResolvedValue(null);

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
        expect(response.body.error).toBe('Already exists an admin with that username');
      });
  });

  test('Given a request with valid body When post and adminService throws error Then should return internal server error response', () => {
    const errorMessage = 'Database connection lost.';

    adminService.create.mockImplementation(() => {
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

  test('Given a request with valid body When post and adminService return created admin Then should return created response', () => {
    const admin = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
    };

    adminService.create.mockResolvedValue(new AdminResponseDto(admin.id, admin.username));

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
        expect(response.headers['Location'.toLowerCase()]).toBe(`${response.request.url}/${admin.id}`);
        expect(response.body.id).toBe(admin.id);
      });
  });
});
