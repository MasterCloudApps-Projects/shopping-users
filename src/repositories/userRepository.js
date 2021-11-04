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

module.exports = { findByUsername, save };
