const UserResponseDto = require('../dtos/userResponseDto.js');

function create(user) {
    return new UserResponseDto(1, user.username, 0.0);
}

module.exports = { create }