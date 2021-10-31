const { Sequelize, DataTypes, Model } = require('sequelize');
const getSequelize = require('../database.js').getSequelize;
const sequelize = getSequelize();
const config = require('../../config/config.js');

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: config['db.db_name'],
    timestamps: false
});

module.exports = User