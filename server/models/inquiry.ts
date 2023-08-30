const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Inquiry extends Model { }

Inquiry.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
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
  inquiry: {
    type: DataTypes.TEXT,
    allowNull: false
  },
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'inquiry'
});

module.exports = Inquiry;
export { };
