const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable('feedbacks', {
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
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable('feedbacks');
  }
};
