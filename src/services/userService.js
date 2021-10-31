const userRepository = require('../repositories/userRepository.js');
const bcrypt = require('bcryptjs');
const UserResponseDto = require('../dtos/userResponseDto.js');

function create(user) {
    return userRepository.findByUsername(user.username)
        .then(foundUser => {
            if (foundUser) {
                console.log(`Username ${user.username} already exists`);
                return null;
            }
            return userRepository.save({
                username: user.username,
                password: user.password ? bcrypt.hashSync(user.password, 8) : user.password
            })
                .then(user => {
                    console.log("Created user", user);
                    return new UserResponseDto(user.id, user.username, user.balance);
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                });
        });
}

module.exports = { create }