const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Customer extends Model { }

Customer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }

  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'customer'
});

module.exports = Customer;
export { };
