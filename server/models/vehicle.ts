const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Vehicle extends Model { }

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  carImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenceNumber: {
    type: DataTypes.STRING(6),
    unique: true,
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Z]{3}-[0-9]{3}$/i,
        msg: 'Licence number must be with format [A-Z][A-Z][A-Z]-[0-9][0-9][0-9]'
      }
    }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900
    }
  },
  engine: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  transmittion: {
    type: DataTypes.ENUM(['Manual', 'Automatic']),
    allowNull: false
  },
  fuel: {
    type: DataTypes.ENUM(['Diesel', 'Petrol', 'Hybrid']),
    allowNull: false,
  },
  fuelEfficiencyCity: {
    type: DataTypes.DECIMAL(10, 1),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  fuelEfficiencyHighway: {
    type: DataTypes.DECIMAL(10, 1),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2,
      max: 9
    }
  },
  rentPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'vehicle'
});

module.exports = Vehicle;
export { };