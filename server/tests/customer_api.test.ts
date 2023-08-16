const { Customer } = require('../models/');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const { sequelize } = require('../utils/db');
const { connectToDatabase } = require('../utils/db');
import supertest from 'supertest';


beforeAll(async () => {
  await connectToDatabase();
});

describe('Starting with 0 customers in db', () => {
  beforeAll(async () => {
    await Customer.destroy({ truncate: { cascade: true } });
  });

  test('registration succeeds with a free username', async () => {
    const newCustomer = {
      name: 'Brad Pitt',
      username: 'Brad P1',
      password: 'password',
    };

    await api
      .post('/api/customers')
      .send(newCustomer)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const customers = await helper.customersInDB();
    expect(customers).toHaveLength(1);
    const matchedCustomer = await helper.customerByUsername(newCustomer.username);
    expect(matchedCustomer).toHaveProperty('username',newCustomer.username);
  });

  test('creation fails with 400 code and correct message if username already taken', async () => {
    const customersBeforeReg = await helper.customersInDB();

    const newCustomer = {
      name: 'Lars Ulrich',
      username: 'Brad P1',
      password: 'tamlalica',
    };

    await api
      .post('/api/customers')
      .send(newCustomer)
      .expect(400)
      .expect({ error: `Username ${newCustomer.username} is taken` });


    const customersAfterReg = await helper.customersInDB();
    expect(customersAfterReg).toEqual(customersBeforeReg);
  });

  test('creation fails with 400 code and correct message for password length is < 5', async () => {
    const customersBeforeReg = await helper.customersInDB();

    const newCustomer = {
      name: 'Cillian Murphy',
      username: 'Cillian M1',
      password: 'Oppenheimer',
    };

    await api
      .post('/api/customers')
      .send(newCustomer)
      .expect(400)
      .expect({ error: 'Password is below 5 characters' });


    const customersAfterReg = await helper.customersInDB();
    expect(customersAfterReg).toEqual(customersBeforeReg);
  });
});

afterAll(async () => {
  await sequelize.close();
});