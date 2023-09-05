import express from 'express';
import reservationService from '../services/reservationService';
import 'express-async-errors';
import proofer from '../utils/requestProofer';
import feedbackService from '../services/feedbackService';
import { EarlyDeleteError, EarlyFeedbackError, FeedbackToDeletedError } from '../utils/errors';
import { Reservation } from '../models';
const { NODE_ENV } = require('../utils/config');
const middleware = require('../utils/middleware');


const customersRouter = express.Router();


customersRouter.get('/current', (req, res) => res.json(req.user));

if (NODE_ENV !== 'test') {
  customersRouter.use(middleware.checkOwner);
}

customersRouter.get('/:id/reservations', async (req, res) => {
  const customerReservations = await reservationService.getCustomerReservations(Number(req.params.id));
  res.json(customerReservations);
});

customersRouter.post('/:id/reservations', async (req, res) => {
  const validatedResBody = await proofer.toNewReservation({ ...req.body, customerId: req.params.id });
  const newReservation = await reservationService.addCustomerReservation(validatedResBody);
  res.status(201).json(newReservation);

});


customersRouter.delete('/:cId/reservations/:rId', async (req, res, next) => {
  try {
    const deleteParams = proofer.toDeleteParams({ customerId: req.params.cId, reservationId: req.params.rId });
    const toBeDeleted = await Reservation.findByPk(deleteParams.reservationId);

    if (new Date(toBeDeleted.toJSON().returnDate) > new Date()) {
      throw new EarlyDeleteError('Deletion failed: cannot delete reservation before it ends');
    }

    await reservationService.deleteReservationForCustomer(deleteParams.reservationId);
    res.status(204).end();

  } catch (err: unknown) {
    next(err);
  }
});

customersRouter.post('/:cId/reservations/:rId/feedback', async (req, res, next) => {
  try {
    const feedbackBody = { reservationId: req.params.rId, ...req.body };
    const { reservationId, rating, comment } = proofer.toNewFeedback(feedbackBody);

    const toBeRated = await Reservation.findByPk(reservationId);
    if (new Date(toBeRated.toJSON().returnDate) > new Date()) {
      throw new EarlyFeedbackError('Rating failed: cannot give feedback before reservation before ends');
    }
    if (toBeRated.toJSON().deletedByUser) {
      throw new FeedbackToDeletedError('Rating failed: cannot give feedback to deleted reservation');
    }

    const newFeedback = await feedbackService.addFeedback({ reservationId, rating, comment });
    res.status(201).json(newFeedback);

  } catch (err: unknown) {
    next(err);
  }
});

export default customersRouter;