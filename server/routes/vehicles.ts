import express from 'express';

const vehiclesRouter = express.Router();

const { Vehicle, Reservation } = require('../models');

vehiclesRouter.get('/', async (req, res) => {
  // TODO: Add query param extractor middleware (extraction, request proofing)
  // TODO: Extract DB communication to service

  let where = {};
  let include: Array<object> = [];
  const requiredParamsPresent = 'brand' in req.query && 'model' in req.query && 'year' in req.query;

  /* If vehicle has active reservation it will be included in the 'reservation' column
      Since only vehicles with 'reservation': null are returned as rentable,
      vehicles with active reservation will be ignored, as they are in use by other customers
    */
  if (requiredParamsPresent) {
    include = [
      {
        model: Reservation,
        required: false, // This allows vehicles with no reservations to be included
        where: {
          endAt: null
        },
      },
    ];
    where = {
      brand: req.query.brand,
      model: req.query.model,
      year: req.query.year,
      available: true,
      '$reservation$': null,
    };
  }
  const toBeRented = await Vehicle.findOne({ include, where });

  if (!toBeRented) {
    return res.status(404).send({ error: 'No vehicles available of said model' });
  }
  return res.json(toBeRented);
});

export default vehiclesRouter;