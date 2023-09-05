import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.renameColumn('reservations', 'start_at', 'rent_date');
    await queryInterface.renameColumn('reservations', 'end_at', 'return_date');
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.renameColumn('reservations', 'rent_date', 'start_at');
    await queryInterface.renameColumn('reservations', 'return_date', 'end_at');
  }
};
