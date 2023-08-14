const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Reservation extends Model { }

Reservation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'customers', key: 'id' },
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehicles', key: 'id' },
  },
  startAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reservation'
});

module.exports = Reservation;
export { };
