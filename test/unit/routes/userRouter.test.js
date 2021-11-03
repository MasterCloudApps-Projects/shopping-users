const userRouter = require('../../../src/routes/userRouter.js');
const supertest = require('supertest');
const app = require('../../../src/app.js');
const userService = require('../../../src/services/userService.js');
const UserResponseDto = require('../../../src/dtos/userResponseDto.js');

const request = supertest(app);

jest.mock('../../../src/services/userService.js');

describe('userRouter POST /api/v1/users tests', () => {

    const POST_URL = '/api/v1/users';

    test('Given a request with invalid body When post Then should return bad request response', () => {

        return request
            .post(POST_URL)
            .send({
                username: "invalidUsername",
                password: "P4ssword"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                expect(response.body.error).toBe("Username must be a valid email")
            });
    })

    test('Given a request with valid body When post and userService return null created user Then should return conflict response', () => {

        userService.create.mockResolvedValue(null);

        return request
            .post(POST_URL)
            .send({
                username: "user@email.com",
                password: "P4ssword"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409)
            .then(response => {
                expect(response.body.error).toBe("Already exists a user with that username")
            });
    })

    test('Given a request with valid body When post and userService throws error Then should return internal server error response', () => {

        const errorMessage = 'Database connection lost.';

        userService.create.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        return request
            .post(POST_URL)
            .send({
                username: "user@email.com",
                password: "P4ssword"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(response => {
                expect(response.body.error).toBe(errorMessage)
            });
    })

    test('Given a request with valid body When post and userService return created user Then should return created response', () => {

        const user = {
            id: 1,
            username: "user@mail.com",
            password: "$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm",
            balance: 0.0
        };

        userService.create.mockResolvedValue(new UserResponseDto(user.id, user.username, user.balance));

        return request
            .post(POST_URL)
            .send({
                username: "user@email.com",
                password: "P4ssword"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(response => {
                expect(response.headers['Location'.toLowerCase()]).toBe(response.request.url + '/' + user.id)
                expect(response.body.id).toBe(user.id)
            });
    })

})