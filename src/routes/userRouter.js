const express = require('express');

const router = express.Router();
const UserRequestDto = require('../dtos/userRequestDto');
const userService = require('../services/userService');
const verifyToken = require('../middlewares/authMiddleware');
const AddBalanceRequestDto = require('../dtos/addBalanceRequestDto');
const verifyPathIdWithAuthenticatedUser = require('../middlewares/userAllowedResource');

router.post('/', async (req, res) => {
  let userDto;
  try {
    userDto = new UserRequestDto(req.body.username, req.body.password);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  try {
    const createdUser = await userService.create(userDto);
    if (!createdUser) {
      return res.status(409).send({ error: 'Already exists a user with that username' });
    }
    return res.header('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdUser.id}`)
      .status(201)
      .json({ id: createdUser.id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

router.get('/:id', verifyToken, verifyPathIdWithAuthenticatedUser, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

router.post('/:id/balance', verifyToken, verifyPathIdWithAuthenticatedUser, async (req, res) => {
  const { id } = req.params;

  let addBalanceRequestDto;
  try {
    addBalanceRequestDto = new AddBalanceRequestDto(req.body.amount);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  try {
    const user = await userService.addBalance(id, addBalanceRequestDto);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
