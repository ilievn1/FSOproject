const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Location extends Model { }

Location.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'location'
});

module.exports = Location;
export { };
