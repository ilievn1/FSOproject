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
  rentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,

  // Paranoid tables need timestamps
  timestamps: true,
  createdAt: false,
  updatedAt: false,

  paranoid: true,
  deletedAt: 'deletedByUser',
  modelName: 'reservation'
});

module.exports = Reservation;
export { };
