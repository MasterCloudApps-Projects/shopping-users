const express = require('express');
const router = express.Router();
const UserRequestDto = require('../dtos/userRequestDto.js');
const userService = require('../services/userService.js');

router.post('/', async (req, res) => {

    let userDto;
    try {
        userDto = new UserRequestDto(req.body.username, req.body.password);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ "error": error.message });
    }

    const createdUser = await userService.create(userDto);
    res.header('Location', req.protocol + '://' + req.get('host') + req.originalUrl + createdUser.id)
        .status(201)
        .json({ id: createdUser.id });

});

module.exports = router;