const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { sequelize } = require('../utils/db');
const { data: seedData } = require('../mockData/cars');
const { connectToDatabase } = require('../utils/db');

beforeAll(async () => {
  await connectToDatabase();
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
  test('succeeds if vehicle is available and not all instances said brand/model/year are reserved', async () => {
    const target = seedData[0];
    const { body } = await api.get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`);
    expect(body[0]).toHaveProperty('licenceNumber', target.licenceNumber);
  });
  test('returns error if all vehicles are not available', async () => {
    const target = seedData[16]; // TODO: test seeding data will have bmw 3 2022 set to available: false and excluded from reservations by backend/pgAdmin
    await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`)
      .expect(404, { error: 'No vehicles available of said model' });


  });
  test('returns error if all vehicles are occupied/reserverd', async () => {
    const target = seedData[17]; // TODO: test seeding data will have 1/2 honda airware 2000 set to available: false excluded from reservations by backend/pgAdmin
    await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`)
      .expect(404, { error: 'No vehicles available of said model' });
  });
  test('returns error if some vehicles of said model are both unavailabe or already reserved', async () => {
    const target = seedData[20]; // TODO: test seeding data will have 2/2 honda airware 2000 set to available: true, but added in reservations by backend/pgAdmin
    await api
      .get(`/api/vehicles?brand=${target.brand}&model=${target.model}&year=${target.year}`)
      .expect(404, { error: 'No vehicles available of said model' });

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