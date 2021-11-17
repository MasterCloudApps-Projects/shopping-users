const User = require('../models/user');

function findByUsername(userName) {
  return User.findOne({ where: { username: userName } });
}

function create(user) {
  return User.create({
    username: user.username,
    password: user.password,
    balance: user.balance,
  });
}

function findById(id) {
  return User.findByPk(id);
}

module.exports = { findByUsername, create, findById };
