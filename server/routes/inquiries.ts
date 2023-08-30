
import express from 'express';
const inquiriesRouter = express.Router();
const { Inquiry } = require('../models');

inquiriesRouter.post('/', async (req, res) => {
  // TODO: Add query param extractor middleware (extraction, request proofing)
  // TODO: Extract DB communication to service
  await Inquiry.create(
    {
      ...req.body
    }
  );
  res.status(201);
});

export default inquiriesRouter;