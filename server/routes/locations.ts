import express from 'express';
import locationService from '../services/locationService';

const locationsRouter = express.Router();

locationsRouter.get('/', async (_req, res) => {
  const locations = await locationService.getAllLocations();
  res.json(locations);
});
export default locationsRouter;