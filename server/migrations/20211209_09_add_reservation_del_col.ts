const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.addColumn('reservations', 'deleted_by_user', {
      type: DataTypes.TIMESTAMP,
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.removeColumn('reservations', 'deleted_by_user');
  }
};
