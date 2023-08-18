const { Customer, Reservation } = require('../models/');
const app = require('../app');
import supertest from 'supertest';
import request from 'supertest';
const api = supertest(app);
const helper = require('./test_helper');
const { sequelize } = require('../utils/db');
const { connectToDatabase } = require('../utils/db');
const bcrypt = require('bcrypt');
import { Customer, Reservation } from '../types';


beforeAll(async () => {
  await connectToDatabase();
  await Reservation.destroy({ truncate: { cascade: true, restartIdentity: true } });
  await Customer.destroy({ truncate: { cascade: true, restartIdentity: true } });
});

describe('Starting with 0 customers in db', () => {
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

  test('creation fails with 409 code and correct message if username already taken', async () => {
    const customersBeforeReg = await helper.customersInDB();

    const newCustomer = {
      name: 'Lars Ulrich',
      username: 'Brad P1',
      password: 'tamlalica',
    };

    await api
      .post('/api/customers')
      .send(newCustomer)
      .expect(409)
      .expect({ error: `Username ${newCustomer.username} is taken` });


    const customersAfterReg = await helper.customersInDB();
    expect(customersAfterReg).toEqual(customersBeforeReg);
  });

  test('creation fails with 403 code and correct message for password length is < 5', async () => {
    const customersBeforeReg = await helper.customersInDB();

    const newCustomer = {
      name: 'Cillian Murphy',
      username: 'Cillian M1',
      password: 'Op',
    };

    await api
      .post('/api/customers')
      .send(newCustomer)
      .expect(403)
      .expect({ error: 'Password is below 5 characters' });


    const customersAfterReg = await helper.customersInDB();
    expect(customersAfterReg).toEqual(customersBeforeReg);
  });
});
describe('Starting with 2 customers in db', () => {
  beforeAll(async () => {
    await Reservation.destroy({ truncate: { cascade: true, restartIdentity: true } });
    await Customer.destroy({ truncate: { cascade: true, restartIdentity: true } });
    const hashedPassword = await bcrypt.hash('password', 10);
    const sampleCustomers = [
      { name: 'Nathan Sebhastian', username: 'NathSab1', hashedPassword },
      { name: 'Elena Kitic', username: 'Eletic23', hashedPassword },
    ];
    await Customer.bulkCreate(sampleCustomers);
    const insertedSampleData = await helper.customersInDB();
    console.log('insertedSampleData', insertedSampleData);
    insertedSampleData.forEach((c: Customer, idx: number) => {
      expect(c).toMatchObject(sampleCustomers[idx]);
    });
  });

  test('customer can make reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const reservationsBefore = await helper.allReservationsByUsername(customer.username);

    const requests = Array.from({ length: 5 }, async (_r, idx) => {
      const newReservation = {
        vehicleId: idx,
        customerId: customer.id,
        startAt: new Date().toJSON().slice(0, 10)
      };
      return await request(app)
        .post(`/api/customers/${customer.id}/reservations`)
        .send(newReservation);
    });

    await Promise.all(requests);
    // const responses = await Promise.all(requests);

    const reservationsAfter = await helper.allReservationsByUsername(customer.username);
    expect(reservationsAfter).toHaveLength(reservationsBefore.length + 5);

    // responses.forEach((resp, idx) => {
    //   expect(resp.status).toBe(201);
    //   expect(resp.headers['Content-Type']).toMatch(/application\/json/);
    //   expect(responses).toEqual(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         vehicleId: idx,
    //         customerId: customer.id,
    //         startAt: new Date().toJSON().slice(0, 10)
    //       }),
    //     ])
    //   );
    //   expect(reservationsAfter).toContainEqual(resp);

    // });

  });

  test('reservations retrieval for customer with reservations succeeds', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const returnedReservations =
      await api
        .get(`/api/customers/${customer.id}/reservations`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const customerReservations = await helper.allReservationsByUsername(customer.username);
    expect(returnedReservations.body).toHaveLength(customerReservations.length);

    returnedReservations.body.forEach((r: Reservation, idx: number) => {
      expect(returnedReservations.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vehicleId: idx,
            customerId: customer.id,
            startAt: new Date().toJSON().slice(0, 10)
          }),
        ])
      );
      expect(customerReservations).toContainEqual(r);
    });
  });

  test('reservations retrieval for customer without reservations succeeds', async () => {
    const customer = await helper.customerByUsername('Eletic23');
    const returnedReservations =
      await api
        .get(`/api/customers/${customer.id}/reservations`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(returnedReservations.body).toHaveLength(0);
  });

  test('customer can return vehicle', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    //TODO: switch to activeReservations and rand reservations
    const reservationsBefore = await helper.allReservationsByUsername(customer.username);
    expect(reservationsBefore[0]).toHaveProperty('endAt', null);

    const returnedEndedRes = await api
      .put(`/api/customers/${customer.id}/reservations`)
      .send({ endAt: new Date().toJSON().slice(0, 10) })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const reservationsAfter = await helper.allReservationsByUsername(customer.username);
    expect(returnedEndedRes).toHaveProperty('endAt', new Date().toJSON().slice(0, 10));
    expect(reservationsAfter[0]).toHaveProperty('endAt', new Date().toJSON().slice(0, 10));
  });

  test('customer can receive active + non rated reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    //TODO: switch to activeReservations and rand reservations
    const reservations = await helper.allReservationsByUsername(customer.username);
    const active = reservations.filter((r: Reservation) => !r.endAt);
    const nonRated = reservations.filter((r: { endAt: string; feedback?: unknown }) => r.endAt && !r.feedback );
    const nonActiveRated = reservations.filter((r: { endAt: string; feedback?: unknown }) => r.endAt && r.feedback);

    expect(active).toEqual(expect.arrayContaining(
      [expect.objectContaining({ endAt: null })]
    ));
    expect(nonRated).toEqual(expect.arrayContaining(
      [expect.objectContaining({ feedback: null })]
    ));

    expect(active.length + nonRated.length).toHaveLength(reservations.length - nonActiveRated.length);

  });
});

// test('should not contain objects with endAt as null', () => {
//   const array = [
//     {
//       endAt: '2021-07-08'
//     },
//     {
//       endAt: '2021-07-09'
//     },
//     // {
//     //   endAt: null
//     // },
//   ];

//   expect(array).not.toEqual(expect.arrayContaining(
//     [expect.objectContaining({ endAt: null })]
//   ));
// });


afterAll(async () => {
  await sequelize.close();
});