import express from 'express';
import customerService from '../services/customerService';
import reservationService from '../services/reservationService';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import proofer from '../utils/requestProofer';
import feedbackService from '../services/feedbackService';

const customersRouter = express.Router();

const { Feedback } = require('../models');

customersRouter.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = proofer.toNewCustomer(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await customerService.addCustomer({ name, username, hashedPassword });
    res.status(201).json(newCustomer);

  } catch (err: unknown) {
    next(err);
  }

});

customersRouter.get('/:id/reservations', async (req, res) => {
  const customerReservations = await reservationService.getCustomerReservations(req.params.id);
  res.json(customerReservations);
});

customersRouter.post('/:id/reservations', async (req, res, next) => {
  try {
    const { vehicleId, customerId, startAt } = proofer.toNewReservation(req.body);
    const newReservation = await reservationService.addCustomerReservation({ vehicleId, customerId, startAt });
    res.status(201).json(newReservation);

  } catch (err: unknown) {
    next(err);
  }

});

customersRouter.put('/:cId/reservations/:rId', async (req, res) => {
  const endedReservation = await reservationService.endCustomerReservation(req.params.rId, req.params.cId);
  res.json(endedReservation);
});

customersRouter.post('/:cId/reservations/:rId/feedback', async (req, res) => {
  try {
    const { reservationId, rating, comment } = proofer.toNewFeedback(req.body);
    const isCreated = await feedbackService.addFeedback({ reservationId, rating, comment });
    if (isCreated) {
      res.status(201).end();
    } else {
      res.status(400).end();
    }

  } catch (err: unknown) {
    res.status(400).end;
  }
});

export default customersRouter;