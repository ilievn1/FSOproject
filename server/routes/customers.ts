import express from 'express';
import reservationService from '../services/reservationService';
import 'express-async-errors';
import proofer from '../utils/requestProofer';
import feedbackService from '../services/feedbackService';

const customersRouter = express.Router();


customersRouter.get('/current', (req, res) => res.json(req.user));

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

customersRouter.post('/:cId/reservations/:rId/feedback', async (req, res, next) => {
  try {
    const feedbackBody = { reservationId: req.params.rId, ...req.body };
    const { reservationId, rating, comment } = proofer.toNewFeedback(feedbackBody);
    const newFeedback = await feedbackService.addFeedback({ reservationId, rating, comment });
    res.status(201).json(newFeedback);

  } catch (err: unknown) {
    next(err);
  }
});

export default customersRouter;