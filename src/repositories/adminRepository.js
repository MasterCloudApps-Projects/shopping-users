const Admin = require('../models/admin');

function findByUsername(userName) {
  return Admin.findOne({ where: { username: userName } });
}

function create(admin) {
  return Admin.create({
    username: admin.username,
    password: admin.password,
  });
}

module.exports = {
  findByUsername, create,
};
