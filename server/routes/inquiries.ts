
import express from 'express';
const inquiriesRouter = express.Router();
import inquiryService from '../services/inquiryService';
import proofer from '../utils/requestProofer';

inquiriesRouter.post('/', async (req, res, next) => {
  await inquiryService.addInquiry(req.body);
  res.status(201);
  try {
    const verifiedInquiryBody = proofer.toNewInquiry(req.body);
    const newReservation = await inquiryService.addInquiry(verifiedInquiryBody);
    res.status(201).json(newReservation);

  } catch (err: unknown) {
    next(err);
  }
});

export default inquiriesRouter;