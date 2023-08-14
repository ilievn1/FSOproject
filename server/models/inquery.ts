const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Inquery extends Model { }

Inquery.init({
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
  inquery: {
    type: DataTypes.TEXT,
    allowNull: false
  },
},
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'inquery'
});

module.exports = Inquery;
export { };
