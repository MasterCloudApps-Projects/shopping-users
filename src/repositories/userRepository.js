const User = require('../models/user');

function findByUsername(userName) {
  return User.findOne({ where: { username: userName } });
}

function save(user) {
  return User.create({
    username: user.username,
    password: user.password,
    balance: user.balance,
  });
}

function findById(id) {
  return User.findById(id);
}

module.exports = { findByUsername, save, findById };
