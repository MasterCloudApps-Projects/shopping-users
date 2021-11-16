const bcrypt = require('bcryptjs');
const userService = require('../../../src/services/userService');
const UserRequestDto = require('../../../src/dtos/userRequestDto');
const userRepository = require('../../../src/repositories/userRepository');
const UserResponseDto = require('../../../src/dtos/userResponseDto');
const UserResponseWithPasswordDto = require('../../../src/dtos/userResponseWithPasswordDto');
const { NoErrorThrownError, getError } = require('../errors/noErrorThrownError');

jest.mock('../../../src/repositories/userRepository.js');
jest.mock('bcryptjs');

const user = {
  id: 1,
  username: 'user@mail.com',
  password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
  balance: 0.0,
};

describe('userService create function tests', () => {
  const userDto = new UserRequestDto(user.username, 'Password1');

  test('Given an existing username When call create Then should not create user and return null', () => {
    userRepository.findByUsername.mockResolvedValue(user);

    return userService.create(userDto)
      .then((createdUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userDto.username);
        expect(createdUser).toBeNull();
      });
  });

  test('Given an not existing username When call create Then should save user and return it', () => {
    userRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hashSync.mockResolvedValue(user.password);
    userRepository.save.mockResolvedValue(user);

    return userService.create(userDto)
      .then((createdUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userDto.username);
        expect(bcrypt.hashSync.mock.calls[0][0]).toBe(userDto.password);
        expect(createdUser).toEqual(new UserResponseDto(user.id, user.username, user.balance));
      });
  });

  test('Given an not existing username When call create and repository throws error Then should throw error', async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    const errorMessage = 'Database connection lost.';
    userRepository.save.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.create(userDto));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});

describe('userService getByUsername function tests', () => {
  test('Given an not existing username When call getUserByUsername Then should return null', () => {
    userRepository.findByUsername.mockResolvedValue(null);

    return userService.getUserByUsername(user.username)
      .then((foundUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(user.username);
        expect(foundUser).toBeNull();
      });
  });

  test('Given an existing username When call getUserByUsername Then should return user with password', () => {
    userRepository.findByUsername.mockResolvedValue(user);

    return userService.getUserByUsername(user.username)
      .then((foundUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(user.username);
        expect(foundUser).toEqual(
          new UserResponseWithPasswordDto(user.id, user.username, user.password),
        );
      });
  });

  test('Given an existing username When call getUserByUsername and repository throws error Then should throw error', async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    const errorMessage = 'Database connection lost.';
    userRepository.findByUsername.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.getUserByUsername(user.username));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});

describe('userService getById function tests', () => {
  test('Given an not existing id When call getUserById Then should return null', () => {
    userRepository.findById.mockResolvedValue(null);

    return userService.getUserById(user.id)
      .then((foundUser) => {
        expect(userRepository.findById.mock.calls[0][0]).toBe(user.id);
        expect(foundUser).toBeNull();
      });
  });

  test('Given an existing id When call getUserById Then should return user', () => {
    userRepository.findById.mockResolvedValue(user);

    return userService.getUserById(user.id)
      .then((foundUser) => {
        expect(userRepository.findById.mock.calls[0][0]).toBe(user.id);
        expect(foundUser).toEqual(
          new UserResponseDto(user.id, user.username, user.balance),
        );
      });
  });

  test('Given an existing id When call getUserById and repository throws error Then should throw error', async () => {
    userRepository.findById.mockResolvedValue(null);

    const errorMessage = 'Database connection lost.';
    userRepository.findById.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.getUserById(user.id));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});
