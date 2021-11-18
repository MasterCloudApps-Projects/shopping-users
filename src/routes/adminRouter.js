const express = require('express');

const router = express.Router();
const UserRequestDto = require('../dtos/userRequestDto');
const adminService = require('../services/adminService');

router.post('/', async (req, res) => {
  let userRequestDto;
  try {
    userRequestDto = new UserRequestDto(req.body);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  try {
    const createdAdmin = await adminService.create(userRequestDto);
    if (!createdAdmin) {
      return res.status(409).send({ error: 'Already exists an admin with that username' });
    }
    return res.header('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdAdmin.id}`)
      .status(201)
      .json({ id: createdAdmin.id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
