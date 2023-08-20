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
    expect(body).toHaveProperty('licenceNumber', target.licenceNumber);
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

  test('previously rented car has been returned and is again available to be reserved', async () => {
    const customer = await helper.customerByUsername('GeBut1');
    const activeBefore = await helper.activeReservationsByUsername(customer.username);
    await helper.endReservation(activeBefore[0].id);

    const target = seedData[20];
    const { body } = await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`);
    expect(body).toHaveProperty('licenceNumber', target.licenceNumber);
  });

});

describe('viewing a specific vehicle based on invalid query params', () => {
  test('non-existent brand returns 404', async () => {
    await api.get('/api/vehicles?brand=Foo&model=NSX&year=1987').expect(404);
  });
  test('non-existent model returns 404', async () => {
    await api.get('/api/vehicles?brand=Honda&model=Foo&year=1987').expect(404);
  });
  test('missing params returns 400', async () => {
    await api.get('/api/vehicles?brand=Foo').expect(400, { error: 'Incorrect data: req.query expected fields are brand, model and year' });

  });
});

afterAll(async () => {
  await sequelize.close();
});