const { Customer, Reservation } = require('../models/');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const { sequelize } = require('../utils/db');
const { connectToDatabase } = require('../utils/db');
const bcrypt = require('bcrypt');
import supertest from 'supertest';
import { Customer, Reservation } from '../types';


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
describe('Starting with 3 customers in db', () => {
  beforeAll(async () => {
    await Customer.destroy({ truncate: { cascade: true } });
    await Reservation.destroy({ truncate: { cascade: true } });
    const hashedPassword = await bcrypt.hash('password', 10);
    const sampleCustomers = [
      { name: 'Nathan Sebhastian', username: 'NathSab1', hashedPassword },
      { name: 'Jack Stark', username: 'JS1984', hashedPassword },
      { name: 'Elena Kitic', username: 'Eletic23', hashedPassword },
    ];
    await Customer.bulkCreate(sampleCustomers);
    const insertedSampleData = await helper.customersInDB();
    insertedSampleData.forEach((c:Customer,idx:number) => {
      expect(c).toMatchObject(sampleCustomers[idx]);
    });
  });

  test('customer can make reservation', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const reservationsBefore = await helper.reservationsByUsername(customer.username);
    const newReservation = {
      vehicleId: 0,
      customerId: customer.id,
      startAt: new Date().toJSON().slice(0, 10)
    };
    const returnedReservation =
    await api
      .post(`/customers/${customer.id}/reservations`)
      .send(newReservation)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const reservationsAfter = await helper.reservationsByUsername(customer.username);
    expect(reservationsBefore).toHaveLength(reservationsBefore + 1);
    expect(reservationsAfter).toContainEqual(returnedReservation.body);

  });

  test('reservations retrieval for customer succeeds', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const returnedReservations = await api
      .get(`/customers/${customer.id}/reservations`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const customerReservations = await helper.reservationsByUsername(customer.username);
    expect(returnedReservations.body).toHaveLength(customerReservations.length);
    customerReservations.forEach((r: Reservation) => {
      expect(returnedReservations.body).toContainEqual(r);
    });
  });


});
// TODO: User specific reservations sub routes
afterAll(async () => {
  await sequelize.close();
});