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
  await Reservation.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Customer.destroy({ truncate: true, cascade: true, restartIdentity: true });
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

  test('customer can make reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const reservationsBefore = await helper.allReservationsByUsername(customer.username);

    const requests = Array.from({ length: 5 }, async (_r, idx) => {
      idx++;
      const newReservation = {
        vehicleId: idx,
        customerId: customer.id,
        startAt: new Date().toJSON().slice(0, 10)
      };
      return await request(app)
        .post(`/api/customers/${customer.id}/reservations`)
        .send(newReservation);
    });

    const responsesObjs = await Promise.all(requests);
    const responsesObjsBodies = responsesObjs.map(r => r.body);

    const reservationsAfter = await helper.allReservationsByUsername(customer.username);
    expect(reservationsAfter).toHaveLength(reservationsBefore.length + 5);
    // Appropriate metadata
    responsesObjs.forEach((resp) => {
      expect(resp.status).toBe(201);
      expect(resp.headers['content-type']).toMatch(/application\/json/);
    });
    // Whatever is sent is returned
    responsesObjsBodies.forEach((_, idx) => {
      idx++;
      expect(responsesObjsBodies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            vehicleId: idx,
            customerId: customer.id,
            startAt: new Date().toJSON().slice(0, 10)
          }),
        ])
      );
    });


  });

  test('reservations retrieval for customer with reservations succeeds', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const returnedReservations =
      await api
        .get(`/api/customers/${customer.id}/reservations`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const customerReservationsInDB = await helper.allReservationsByUsername(customer.username);
    console.log('#1\ncustomerReservationsInDB\n', customerReservationsInDB);
    console.log('#2\nreturnedReservations.body\n', returnedReservations.body);
    // DB saved content corresponds user submitted content
    returnedReservations.body.forEach((retRes: Reservation) => {
      expect(customerReservationsInDB).toEqual(
        expect.arrayContaining([
          // Partial checking for ommiting id field and feedback field
          expect.objectContaining(retRes),
        ])
      );
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

  test('customer can return vehicle / end reservation', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const activeBefore = await helper.activeReservationsByUsername(customer.username);
    const toBeEnded = activeBefore[0];
    expect(toBeEnded).toHaveProperty('endAt', null);

    const returnedEndedRes = await api
      .put(`/api/customers/${customer.id}/reservations/${toBeEnded.id}`)
      .send({ endAt: new Date().toJSON().slice(0, 10) })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const activeAfter = await helper.activeReservationsByUsername(customer.username);
    expect(activeAfter).toHaveLength(activeBefore.length - 1 );
    expect(returnedEndedRes.body).toHaveProperty('endAt', new Date().toJSON().slice(0, 10));
  });

  test('customer can receive active + non rated reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const returnedReservations =
      await api
        .get(`/api/customers/${customer.id}/reservations`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    console.log('#3\nreturnedReservations.body\n', returnedReservations.body);
    const active = returnedReservations.body.filter((r: Reservation) => !r.endAt);
    const nonRated = returnedReservations.body.filter((r: { endAt: string; feedback?: unknown }) => r.endAt && !r.feedback );
    
    const reservationsInDB = await helper.allReservationsByUsername(customer.username);
    console.log('#4\reservationsInDB\n', reservationsInDB);
    const nonActiveRated = reservationsInDB.filter((r: { endAt: string; feedback?: unknown }) => r.endAt && r.feedback);

    expect(active).toEqual(expect.arrayContaining(
      [expect.objectContaining({ endAt: null })]
    ));
    expect(nonRated).toEqual(expect.arrayContaining(
      [expect.objectContaining({ feedback: null })]
    ));

    expect(active.length + nonRated.length).toBe(reservationsInDB.length - nonActiveRated.length);

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