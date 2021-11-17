const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const UserResponseDto = require('../dtos/userResponseDto');
const UserResponseWithPasswordDto = require('../dtos/userResponseWithPasswordDto');

function create(user) {
  return userRepository.findByUsername(user.username)
    .then((foundUser) => {
      if (foundUser) {
        console.log(`Username ${user.username} already exists`);
        return null;
      }
      return userRepository.create({
        username: user.username,
        password: user.password ? bcrypt.hashSync(user.password, 8) : user.password,
        balance: 0.0,
      })
        .then((savedUser) => {
          console.log('Created user', savedUser);
          return new UserResponseDto(savedUser.id, savedUser.username, savedUser.balance);
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    });
}

function getUserByUsername(userName) {
  return userRepository.findByUsername(userName)
    .then((foundUser) => {
      if (foundUser === null) {
        console.log('Not found user with username', userName);
        return foundUser;
      }
      console.log('Found user with username', userName, foundUser);
      return new UserResponseWithPasswordDto(foundUser.id, foundUser.username, foundUser.password);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function getUserById(id) {
  return userRepository.findById(id)
    .then((foundUser) => {
      if (foundUser === null) {
        console.log('Not found user with id', id);
        return foundUser;
      }
      console.log('Found user with id', id, foundUser);
      return new UserResponseDto(foundUser.id, foundUser.username, foundUser.balance);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

module.exports = { create, getUserByUsername, getUserById };
