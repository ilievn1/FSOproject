const { Customer, Reservation } = require('../models/');
const app = require('../app');
import supertest from 'supertest';
const api = supertest(app);
const helper = require('./test_helper');
const { sequelize } = require('../utils/db');
const { connectToDatabase } = require('../utils/db');
const bcrypt = require('bcrypt');
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
    expect(matchedCustomer).toHaveProperty('username', newCustomer.username);
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
describe('Starting with 2 customers in db', () => {
  beforeAll(async () => {
    await Customer.destroy({ truncate: { cascade: true } });
    await Reservation.destroy({ truncate: { cascade: true } });
    const hashedPassword = await bcrypt.hash('password', 10);
    const sampleCustomers = [
      { name: 'Nathan Sebhastian', username: 'NathSab1', hashedPassword },
      { name: 'Elena Kitic', username: 'Eletic23', hashedPassword },
    ];
    await Customer.bulkCreate(sampleCustomers);
    const insertedSampleData = await helper.customersInDB();
    insertedSampleData.forEach((c: Customer, idx: number) => {
      expect(c).toMatchObject(sampleCustomers[idx]);
    });
  });

  test('customer can make reservation', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const reservationsBefore = await helper.allReservationsByUsername(customer.username);
    const newReservation = {
      vehicleId: 1,
      customerId: customer.id,
      startAt: new Date().toJSON().slice(0, 10)
    };
    const returnedReservation =
      await api
        .post(`/customers/${customer.id}/reservations`)
        .send(newReservation)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const reservationsAfter = await helper.allReservationsByUsername(customer.username);
    expect(reservationsBefore).toHaveLength(reservationsBefore.length + 1);
    expect(reservationsAfter).toContainEqual(returnedReservation.body);

  });

  test('reservations retrieval for customer with reservations succeeds', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const returnedReservations =
      await api
        .get(`/customers/${customer.id}/reservations`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const customerReservations = await helper.allReservationsByUsername(customer.username);
    expect(returnedReservations.body).toHaveLength(customerReservations.length);
    returnedReservations.body.forEach((r: Reservation) => {
      expect(customerReservations).toContainEqual(r);
    });
  });

  test('reservations retrieval for customer without reservations succeeds', async () => {
    const customer = await helper.customerByUsername('Eletic23');
    const returnedReservations =
      await api
        .get(`/customers/${customer.id}/reservations`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    expect(returnedReservations.body).toHaveLength(0);
  });

  test('customer can return vehicle', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    //TODO: switch to activeReservations
    const reservationsBefore = await helper.allReservationsByUsername(customer.username);
    expect(reservationsBefore[0]).toHaveProperty('endAt', null);
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

    const reservationsAfter = await helper.allReservationsByUsername(customer.username);
    expect(reservationsAfter).toContainEqual(returnedReservation.body);

  });
});

test('queryTest', async () => {
  const nonRated = await helper.nonRatedReservationsByUsername('NathSab1');
  console.log('nonRated',nonRated);
  expect(1).toBe(1);
});

afterAll(async () => {
  await sequelize.close();
});