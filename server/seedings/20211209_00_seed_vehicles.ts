import { QueryInterface } from 'sequelize';
import { data as seedData } from '../mockData/cars';

const seedVehicles = seedData.map(obj => {
  const { carImage, fuelEfficiencyCity, fuelEfficiencyHighway, licenceNumber, rentPrice, ...rest } = obj;
  return {
    car_image: carImage,
    fuel_efficiency_city: fuelEfficiencyCity,
    fuel_efficiency_highway: fuelEfficiencyHighway,
    licence_number: licenceNumber,
    rent_price: rentPrice,
    ...rest
  };
});

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkInsert('vehicles', seedVehicles);
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.bulkDelete('vehicles', { id: seedVehicles.map(v => v.id) });
  }

};