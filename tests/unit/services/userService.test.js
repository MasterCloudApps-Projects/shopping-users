const bcrypt = require('bcryptjs');
const userService = require('../../../src/services/userService');
const UserRequestDto = require('../../../src/dtos/userRequestDto');
const userRepository = require('../../../src/repositories/userRepository');
const UserResponseDto = require('../../../src/dtos/userResponseDto');
const UserResponseWithPasswordDto = require('../../../src/dtos/userResponseWithPasswordDto');
const { NoErrorThrownError, getError } = require('../errors/noErrorThrownError');
const AddBalanceRequestDto = require('../../../src/dtos/addBalanceRequestDto');

jest.mock('../../../src/repositories/userRepository.js');
jest.mock('bcryptjs');

const user = {
  id: 1,
  username: 'user@mail.com',
  password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
  balance: 0.0,
};
const errorMessage = 'Database connection lost.';

describe('userService create function tests', () => {
  const userRequestDto = new UserRequestDto({ username: user.username, password: 'Password1' });

  test('Given an existing username When call create Then should not create user and return null', () => {
    userRepository.findByUsername.mockResolvedValue(user);

    return userService.create(userRequestDto)
      .then((createdUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userRequestDto.username);
        expect(createdUser).toBeNull();
      });
  });

  test('Given an not existing username When call create Then should save user and return it', () => {
    userRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hashSync.mockResolvedValue(user.password);
    userRepository.create.mockResolvedValue(user);

    return userService.create(userRequestDto)
      .then((createdUser) => {
        expect(userRepository.findByUsername.mock.calls[0][0]).toBe(userRequestDto.username);
        expect(bcrypt.hashSync.mock.calls[0][0]).toBe(userRequestDto.password);
        expect(createdUser).toEqual(new UserResponseDto(user.id, user.username, user.balance));
      });
  });

  test('Given an not existing username When call create and repository throws error Then should throw error', async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    userRepository.create.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.create(userRequestDto));

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

    userRepository.findById.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.getUserById(user.id));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});

describe('userService addBalance function tests', () => {
  const addBalanceRequestDto = new AddBalanceRequestDto({ amount: 10.53 });
  test('Given an not existing id When call addBalance Then should return null', () => {
    userRepository.findById.mockResolvedValue(null);

    return userService.addBalance(user.id, addBalanceRequestDto)
      .then((foundUser) => {
        expect(userRepository.findById.mock.calls[0][0]).toBe(user.id);
        expect(foundUser).toBeNull();
      });
  });

  test('Given an existing id When call addBalance Then should return user with updated balance', () => {
    userRepository.findById.mockResolvedValue(user);

    const updatedBalanceUser = {
      id: 1,
      username: 'user@mail.com',
      password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
      balance: user.balance + addBalanceRequestDto.amount,
    };
    userRepository.save.mockResolvedValue(updatedBalanceUser);

    return userService.addBalance(user.id, addBalanceRequestDto)
      .then((updatedUser) => {
        expect(userRepository.findById.mock.calls[0][0]).toBe(user.id);
        expect(updatedUser).toEqual(
          new UserResponseDto(
            updatedBalanceUser.id, updatedBalanceUser.username, updatedBalanceUser.balance,
          ),
        );
      });
  });

  test('Given an existing id When call addBalance and repository throws error Then should throw error', async () => {
    userRepository.findById.mockResolvedValue(user);

    userRepository.save.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => userService.addBalance(user.id, addBalanceRequestDto));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});
