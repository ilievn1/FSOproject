import express from 'express';
import { Op } from 'sequelize';
const bcrypt = require('bcrypt');

const customersRouter = express.Router();

const { Reservation, Customer, Feedback } = require('../models');

customersRouter.post('/', async (req, res) => {
  // TODO: Add query param extractor middleware (extraction, request proofing)
  // TODO: Extract to error handling to middleware - upon create fail, customer not created, rather exception handled directly to errorHandler
  // TODO: Extract DB communication to service
  if (req.body.password.length < 5) {
    return res.status(403).send({ error: 'Password is below 5 characters' });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCustomer = await Customer.create({ name: req.body.name, username: req.body.username, hashedPassword });
    return res.status(201).json(newCustomer.toJSON());
  } catch (err) {
    return res.status(409).send({ error: `Username ${req.body.username} is taken` });
  }

});
// TODO: Add query param extractor middleware (extraction, request proofing)
// TODO: Extract to error handling to middleware
// TODO: Extract DB communication to service

customersRouter.get('/:id/reservations', async (req, res) => {
  const customerReservations = await Reservation.findAll({
    include: [{ model: Feedback }],
    where: {
      customerId: req.params.id,
      [Op.or]: [
        {
          endAt: null
        },
        {
          '$feedback$': null,
        }
      ]
    },
  });
  res.json(customerReservations);
});

customersRouter.post('/:id/reservations', async (req, res) => {
  const newReservation = await Reservation.create(req.body);
  res.status(201).json(newReservation);
});

customersRouter.put('/:cId/reservations/:rId', async (req, res) => {
  const toBeEnded = await Reservation.findOne({
    where: {
      id: req.params.rId,
      customerId: req.params.cId,
    },
  });
  toBeEnded.endAt = new Date().toJSON().slice(0, 10);
  await toBeEnded.save();
  res.json(toBeEnded);
});

customersRouter.post('/:cId/reservations/:rId/feedback', async (req, res) => {
  const newReservation = await Feedback.create(
    {
      reservationId: req.params.rId,
      ...req.body
    }
  );
  res.status(201).json(newReservation);
});

export default customersRouter;