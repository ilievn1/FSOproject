import { QueryInterface } from 'sequelize';
import { seedLocations } from '../mockData/locations';


module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkInsert('locations', seedLocations);
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkDelete('locations', { id: seedLocations.map(v => v.id) });
  }

};