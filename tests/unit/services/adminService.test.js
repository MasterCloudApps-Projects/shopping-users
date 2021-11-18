const bcrypt = require('bcryptjs');
const adminService = require('../../../src/services/adminService');
const UserRequestDto = require('../../../src/dtos/userRequestDto');
const adminRepository = require('../../../src/repositories/adminRepository');
const AdminResponseDto = require('../../../src/dtos/adminResponseDto');
const UserResponseWithPasswordDto = require('../../../src/dtos/userResponseWithPasswordDto');
const { NoErrorThrownError, getError } = require('../errors/noErrorThrownError');

jest.mock('../../../src/repositories/adminRepository.js');
jest.mock('bcryptjs');

const admin = {
  id: 1,
  username: 'user@mail.com',
  password: '$2a$12$J7tW/LO4uwrskFEM3qNMPeEAifaxUAXuDqCC4L0U70rzEHCj6Sabm',
};
const errorMessage = 'Database connection lost.';

describe('adminService create function tests', () => {
  const userRequestDto = new UserRequestDto({ username: admin.username, password: 'Password1' });

  test('Given an existing username When call create Then should not create admin and return null', () => {
    adminRepository.findByUsername.mockResolvedValue(admin);

    return adminService.create(userRequestDto)
      .then((createdAdmin) => {
        expect(adminRepository.findByUsername.mock.calls[0][0]).toBe(userRequestDto.username);
        expect(createdAdmin).toBeNull();
      });
  });

  test('Given an not existing username When call create Then should save admin and return it', () => {
    adminRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hashSync.mockResolvedValue(admin.password);
    adminRepository.create.mockResolvedValue(admin);

    return adminService.create(userRequestDto)
      .then((createdAdmin) => {
        expect(adminRepository.findByUsername.mock.calls[0][0]).toBe(userRequestDto.username);
        expect(bcrypt.hashSync.mock.calls[0][0]).toBe(userRequestDto.password);
        expect(createdAdmin).toEqual(new AdminResponseDto(admin.id, admin.username));
      });
  });

  test('Given an not existing username When call create and repository throws error Then should throw error', async () => {
    adminRepository.findByUsername.mockResolvedValue(null);

    adminRepository.create.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => adminService.create(userRequestDto));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});

describe('adminService getByUsername function tests', () => {
  test('Given an not existing username When call getByUsername Then should return null', () => {
    adminRepository.findByUsername.mockResolvedValue(null);

    return adminService.getByUsername(admin.username)
      .then((foundAdmin) => {
        expect(adminRepository.findByUsername.mock.calls[0][0]).toBe(admin.username);
        expect(foundAdmin).toBeNull();
      });
  });

  test('Given an existing username When call getByUsername Then should return user with password', () => {
    adminRepository.findByUsername.mockResolvedValue(admin);

    return adminService.getByUsername(admin.username)
      .then((foundAdmin) => {
        expect(adminRepository.findByUsername.mock.calls[0][0]).toBe(admin.username);
        expect(foundAdmin).toEqual(
          new UserResponseWithPasswordDto(admin.id, admin.username, admin.password),
        );
      });
  });

  test('Given an existing username When call getByUsername and repository throws error Then should throw error', async () => {
    adminRepository.findByUsername.mockResolvedValue(null);

    adminRepository.findByUsername.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const error = await getError(async () => adminService.getByUsername(admin.username));

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toHaveProperty('message', errorMessage);
  });
});
