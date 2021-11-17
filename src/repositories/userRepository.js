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

function save(user) {
  return user.save();
}

module.exports = {
  findByUsername, create, findById, save,
};
