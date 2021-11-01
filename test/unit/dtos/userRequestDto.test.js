const UserRequestDto = require('../../../src/dtos/userRequestDto.js');

describe('userRequestDto tests', () => {

    test('Given an invalid username When call constructor Then should throw an error', async () => {

        try {
            new UserRequestDto("notAnEmail", "P4ssword");
        } catch (e) {
            expect(e.message).toEqual("Username must be a valid email");
        }

    })

    test('Given an invalid password without uppercase When call constructor Then should throw an error', async () => {

        try {
            new UserRequestDto("user@email.com", "p4ssword");
        } catch (e) {
            expect(e.message).toEqual("Password must have UpperCase, LowerCase and Number with at least 8 characters");
        }

    })

    test('Given an invalid password without lowercase When call constructor Then should throw an error', async () => {

        try {
            new UserRequestDto("user@email.com", "P4SSWORD");
        } catch (e) {
            expect(e.message).toEqual("Password must have UpperCase, LowerCase and Number with at least 8 characters");
        }

    })

    test('Given an invalid password without number When call constructor Then should throw an error', async () => {

        try {
            new UserRequestDto("user@email.com", "Password");
        } catch (e) {
            expect(e.message).toEqual("Password must have UpperCase, LowerCase and Number with at least 8 characters");
        }

    })

    test('Given an invalid password without eight characters When call constructor Then should throw an error', async () => {

        try {
            new UserRequestDto("user@email.com", "P4sswor");
        } catch (e) {
            expect(e.message).toEqual("Password must have UpperCase, LowerCase and Number with at least 8 characters");
        }

    })

    test('Given an valid username and password When call constructor Then should return a UserRequestDto', () => {

        const userRequestDto = new UserRequestDto("user@email.com", "P4ssword1");

        expect(userRequestDto.username).toBe("user@email.com");
        expect(userRequestDto.password).toBe("P4ssword1");


    })

})