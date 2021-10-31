const express = require('express');
const router = express.Router();
const UserRequestDto = require('../dtos/userRequestDto.js');

router.post('/', async (req, res) => {

    let userDto;
    try {
        userDto = new UserRequestDto(req.body.username, req.body.password);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ "error": error.message });
    }

    const userId = 1;
    res.header('Location', req.protocol + '://' + req.get('host') + req.originalUrl + '/' + userId)
        .status(201)
        .json({ id: userId });

});

module.exports = router;