import express from 'express';
import vehicleService from '../services/vehicleService';
import proofer from '../utils/requestProofer';

const vehiclesRouter = express.Router();

vehiclesRouter.get('/', async (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    const toBeRented = await vehicleService.getAllVehicles();
    res.json(toBeRented);
    return;
  }

  if (Object.keys(req.query).length === 1 && 'top' in req.query) {
    const topRated = await vehicleService.getTopThreeByRating();
    res.json(topRated);
    return;
  }

  try {
    const searchParams = proofer.toSearchParams(req.query);
    const toBeRented = await vehicleService.getRentableVehicle(searchParams);

    if (toBeRented) {
      res.json(toBeRented);
    } else {
      res.status(404).send({ error: 'No vehicles available of said model' });
    }
  } catch (err: unknown) {
    next(err);
    // if (error instanceof Error) {
    //   res.status(400).send({ error: error.message });
    // }
  }
});

export default vehiclesRouter;