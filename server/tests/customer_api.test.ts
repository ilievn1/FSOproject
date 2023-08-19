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
    //console.log('#1\ncustomerReservationsInDB\n', customerReservationsInDB);
    //console.log('#2\nreturnedReservations.body\n', returnedReservations.body);
    // DB saved content corresponds user submitted content
    returnedReservations.body.forEach((retRes: Reservation) => {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const { feedback, ...woFeedback } = retRes;
      expect(customerReservationsInDB).toEqual(
        expect.arrayContaining([
          // Partial checking for feedback field
          expect.objectContaining(woFeedback),
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

  test('customer can return vehicles / end reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const activeBefore = await helper.activeReservationsByUsername(customer.username);
    const toBeEnded = activeBefore.slice(0, -1);

    expect(toBeEnded).toEqual(expect.arrayContaining(
      [expect.objectContaining({ endAt: null })]
    ));

    const requests = toBeEnded.map(async (r: Reservation) => {
      return await request(app)
        .put(`/api/customers/${customer.id}/reservations/${r.id}`);
    });

    const responsesObjs = await Promise.all(requests);
    const responsesObjsBodies = responsesObjs.map(r => r.body);
    // Appropriate metadata
    responsesObjs.forEach((resp) => {
      expect(resp.status).toBe(200);
      expect(resp.headers['content-type']).toMatch(/application\/json/);
    });

    // Server responds with updated end date
    responsesObjsBodies.forEach((r) => {
      expect(responsesObjsBodies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...r,
            endAt: new Date().toJSON().slice(0, 10)
          }),
        ])
      );
    });

    // DB entries updated
    const activeAfter = await helper.activeReservationsByUsername(customer.username);
    expect(activeAfter).toHaveLength(activeBefore.length - toBeEnded.length);
  });

  test('customer can give feedback rating on returned vehicle / ended reservation', async () => {
    const customer = await helper.customerByUsername('NathSab1');
    const endedNonRatedRes = await helper.nonRatedReservationsByUsername(customer.username);
    const toBeRated = endedNonRatedRes.slice(0, 2);

    await api
      .post(`/api/customers/${customer.id}/reservations/${toBeRated[0].id}/feedback`)
      .send({ rating: 5, comment: 'Had great experience!' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api
      .post(`/api/customers/${customer.id}/reservations/${toBeRated[1].id}/feedback`)
      .send({ rating: 4, comment: 'The ride was pleasant and customer support responsive' })
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('customer can receive active + non rated reservations', async () => {
    const customer = await helper.customerByUsername('NathSab1');

    const returnedReservations =
      await api
        .get(`/api/customers/${customer.id}/reservations`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const active = returnedReservations.body.filter((r: Reservation) => !r.endAt);
    const nonRated = returnedReservations.body.filter((r: { endAt: string; feedback?: unknown }) => r.endAt && !r.feedback);

    expect(active).toEqual(expect.arrayContaining(
      [expect.objectContaining({ endAt: null })]
    ));
    expect(nonRated).toEqual(expect.arrayContaining(
      [expect.objectContaining({ feedback: null })]
    ));

    const reservationsInDB = await helper.allReservationsByUsername(customer.username);

    const rated = await helper.ratedReservationsByUsername(customer.username);

    expect(active.length + nonRated.length).toBe(reservationsInDB.length - rated.length);

  });
});

afterAll(async () => {
  await sequelize.close();
});