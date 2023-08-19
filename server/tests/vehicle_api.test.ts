const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const { sequelize } = require('../utils/db');
const { data: seedData } = require('../mockData/cars');
const { connectToDatabase } = require('../utils/db');
const { Customer, Reservation, Feedback } = require('../models');

beforeAll(async () => {
  await connectToDatabase();
  await Feedback.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Reservation.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Customer.destroy({ truncate: true, cascade: true, restartIdentity: true });

});

describe('when seeded vehicles are in DB', () => {
  test('vehicles are return type is json', async () => {
    await api
      .get('/api/vehicles')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all vehicles are returned', async () => {
    const response = await api.get('/api/vehicles');
    expect(response.body).toHaveLength(seedData.length);
  });

});

describe('viewing a specific vehicle based on valid query params', () => {
  beforeAll(async () => {
    // 1/1 BMW M3
    const inRepairVehicle = seedData[16];

    // 1/2 Honda Airwave
    const nonAvailableVehicle = seedData[17];

    await helper.toggleVehicleAvailability(inRepairVehicle.id, false);
    await helper.toggleVehicleAvailability(nonAvailableVehicle.id, false);

    // 2/2 Honda Airwave
    const reservedVehicle = seedData[20];

    const testCustomer = await helper.createCustomer('Gerard Butler', 'GeBut1');
    await helper.createReservation(testCustomer.id, reservedVehicle.id);
  });
  test('succeeds if vehicle is available and not all instances said brand/model/year are reserved', async () => {
    const target = seedData[0];
    const { body } = await api.get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`);
    expect(body[0]).toHaveProperty('licenceNumber', target.licenceNumber);
  });

  test('returns error if all vehicles are not available', async () => {
    const target = seedData[16];
    await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`)
      .expect(404, { error: 'No vehicles available of said model' });
  });

  test('returns error if some vehicles of said model are either all unavailabe or already reserved', async () => {
    const target = seedData[20];
    await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`)
      .expect(404, { error: 'No vehicles available of said model' });
  });


  test('chcking how veh with ended res looks like', async () => {
    await helper.endReservation(1);
    console.log('Reservation ended!');

    const target = seedData[20];
    const { body } = await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`);
    expect(1).toBe(1);
    console.log(body);
  });
  test('new res on veh with end res date set looks like', async () => {
    const testCustomer = await helper.createCustomer('Ian Fleming', 'Iatsuki1');
    const target = seedData[20];
    await helper.createReservation(testCustomer.id, target.id);
    console.log('Reservation made!');

    const { body } = await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`);
    expect(1).toBe(1);
    console.log(body);
  });

});

describe('viewing a specific vehicle based on invalid query params', () => {
  test('returns 404', async () => {
    await api.get('/api/vehicles?brand=Foo&model=Bar&year=1987').expect(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});