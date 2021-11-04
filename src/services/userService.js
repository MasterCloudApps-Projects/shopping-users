const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const UserResponseDto = require('../dtos/userResponseDto');

function create(user) {
  return userRepository.findByUsername(user.username)
    .then((foundUser) => {
      if (foundUser) {
        console.log(`Username ${user.username} already exists`);
        return null;
      }
      return userRepository.save({
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

module.exports = { create };
