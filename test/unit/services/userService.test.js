const userService = require('../../../src/services/userService.js');
const UserRequestDto = require('../../../src/dtos/userRequestDto.js');
const userRepository = require('../../../src/repositories/userRepository.js');
const bcrypt = require('bcryptjs');
const UserResponseDto = require('../../../src/dtos/userResponseDto.js');

jest.mock('../../../src/repositories/userRepository.js');
jest.mock('bcryptjs');

describe('userService create function tests', () => {

    const user = {
        id: 1,
        username: "user@mail.com",
        password: "$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm",
        balance: 0.0
    };

    const userDto = new UserRequestDto(user.username, "Password1");

    test('Given an existing username When call create Then should not create user and return null', () => {
        userRepository.findByUsername.mockResolvedValue(user);

        return userService.create(userDto)
            .then(createdUser => {
                expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userDto.username)
                expect(createdUser).toBeNull()
            })
    })

    test('Given an not existing username When call create Then should save user and return it', () => {
        userRepository.findByUsername.mockResolvedValue(null);
        bcrypt.hashSync.mockResolvedValue(user.password);
        userRepository.save.mockResolvedValue(user);

        return userService.create(userDto)
            .then(createdUser => {
                expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userDto.username)
                expect(bcrypt.hashSync.mock.calls[0][0]).toBe(userDto.password)
                expect(createdUser).toEqual(new UserResponseDto(user.id, user.username, user.balance))
            })
    })

    test('Given an not existing username When call create and repository throws error Then should throw error', async () => {
        userRepository.findByUsername.mockResolvedValue(null);

        const errorMessage = 'Database connection lost.';
        userRepository.save.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        try {
            await userService.create(userDto);
        } catch (e) {
            expect(e.message).toEqual(errorMessage);
        }
    })
})