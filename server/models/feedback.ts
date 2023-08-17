const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Feedback extends Model { }

Feedback.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reservationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'reservations', key: 'id' },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: {
        args: [[1, 2, 3, 4, 5]],
        msg: 'Must be integer between 1 and 5'
      }
    }
  },
  comment: {
    type: DataTypes.TEXT,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'feedback'
});

module.exports = Feedback;
export { };
