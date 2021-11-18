const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const UserRequestDto = require('../dtos/userRequestDto');

const config = require('../../config/config');

const INVALID_CREDENTIALS_MSG = 'Invalid credentials.';

router.post('/', async (req, res) => {
  let userRequestDto;
  try {
    userRequestDto = new UserRequestDto(req.body);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  try {
    const userWithPasswordDto = await userService.getUserByUsername(userRequestDto.username);
    if (!userWithPasswordDto) {
      return res.status(401).send({ error: INVALID_CREDENTIALS_MSG });
    }
    const passwordIsValid = bcrypt.compareSync(
      userRequestDto.password, userWithPasswordDto.password,
    );
    if (!passwordIsValid) {
      return res.status(401).send({ error: INVALID_CREDENTIALS_MSG });
    }
    const token = jwt.sign({ id: userWithPasswordDto.id, role: 'USER_ROLE' }, config.secret, {
      expiresIn: config['token.expiration'],
    });
    return res.status(200).json({ token: `${token}` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
