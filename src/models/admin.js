const { DataTypes, Model } = require('sequelize');
const { getSequelize } = require('../database');

const sequelize = getSequelize();

class Admin extends Model { }

Admin.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'admins',
  timestamps: false,
});

module.exports = Admin;
