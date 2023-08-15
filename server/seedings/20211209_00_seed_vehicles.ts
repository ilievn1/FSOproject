import { QueryInterface } from 'sequelize';
import { seedVehicles } from '../mockData/cars';


module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkInsert('vehicles', seedVehicles);
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkDelete('vehicles', { id: seedVehicles.map(v => v.id) });
  }

};