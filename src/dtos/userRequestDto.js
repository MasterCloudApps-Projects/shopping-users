class UserRequestDto {
    
    constructor(username, password) {
        if (!this.isValidUsername(username)) {
            throw new Error("Username must be a valid email")
        }

        if (!this.isValidPassword(password)) {
            throw new Error("Password must have UpperCase, LowerCase and Number with at least 8 characters")
        }

        return {
            username: username,
            password: password
        }
    }

    matchPattern(target, pattern) {
        return typeof target == 'string' && target != "" && pattern.test(target);
    }
    
    isValidUsername(username) {
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
        return this.matchPattern(username, mailFormat);
    }
    
    isValidPassword(password) {
        let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
    
        return this.matchPattern(password, passwordFormat);
    }
}

module.exports = UserRequestDto