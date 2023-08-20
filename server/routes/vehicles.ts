import express from 'express';
import vehicleService from '../services/vehicleService';
import proofer from '../utils/requestProofer';

const vehiclesRouter = express.Router();

vehiclesRouter.get('/', async (req, res) => {

  const searchParams = proofer.toSearchParams(req.query);
  const toBeRented = await vehicleService.getRentableVehicle(searchParams);

  if (toBeRented) {
    res.json(toBeRented);
  } else {
    res.status(404).send({ error: 'No vehicles available of said model' });
  }
});

export default vehiclesRouter;