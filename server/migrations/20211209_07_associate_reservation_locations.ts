const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';
module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.addColumn('reservations', 'pick_up_location', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'locations', key: 'id' },
    });
    await queryInterface.addColumn('reservations', 'drop_off_location', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'locations', key: 'id' },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.removeColumn('reservations', 'pick_up_location');
    await queryInterface.removeColumn('reservations', 'drop_off_location');
  },
};