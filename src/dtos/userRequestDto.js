class UserRequestDto {
  constructor(username, password) {
    if (!UserRequestDto.isValidUsername(username)) {
      throw new Error('Username must be a valid email');
    }

    if (!UserRequestDto.isValidPassword(password)) {
      throw new Error('Password must have UpperCase, LowerCase and Number with at least 8 characters');
    }

    return {
      username,
      password,
    };
  }

  static matchPattern(target, pattern) {
    return typeof target === 'string' && target !== '' && pattern.test(target);
  }

  static isValidUsername(username) {
    const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return UserRequestDto.matchPattern(username, mailFormat);
  }

  static isValidPassword(password) {
    const passwordFormat = /(?=^.{8,}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;

    return UserRequestDto.matchPattern(password, passwordFormat);
  }
}

module.exports = UserRequestDto;
