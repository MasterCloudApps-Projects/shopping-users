const bcrypt = require('bcryptjs');
const adminRepository = require('../repositories/adminRepository');
const AdminResponseDto = require('../dtos/adminResponseDto');
const UserResponseWithPasswordDto = require('../dtos/userResponseWithPasswordDto');

function create(admin) {
  return adminRepository.findByUsername(admin.username)
    .then((foundAdmin) => {
      if (foundAdmin) {
        console.log(`Username ${admin.username} already exists`);
        return null;
      }
      return adminRepository.create({
        username: admin.username,
        password: admin.password ? bcrypt.hashSync(admin.password, 8) : admin.password,
      })
        .then((savedAdmin) => {
          console.log('Created admin', savedAdmin);
          return new AdminResponseDto(savedAdmin.id, savedAdmin.username);
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    });
}

function getByUsername(userName) {
  return adminRepository.findByUsername(userName)
    .then((foundAdmin) => {
      if (foundAdmin === null) {
        console.log('Not found admin with username', userName);
        return foundAdmin;
      }
      console.log('Found admin with username', userName, foundAdmin);
      return new UserResponseWithPasswordDto(
        foundAdmin.id, foundAdmin.username, foundAdmin.password,
      );
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

module.exports = {
  create, getByUsername,
};
