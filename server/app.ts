import express, { Request } from 'express';
import morgan from 'morgan';
import { Op } from 'sequelize';
const cors = require('cors');
require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');
const { Vehicle } = require('./models');
const { Reservation } = require('./models');

interface WhereProps {
  [key: symbol]: unknown;
}


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/vehicles', async (req, res) => {
  const where: WhereProps = {};
  let include: Array<object> = [];
  const requiredParamsPresent = 'brand' in req.query && 'model' in req.query && 'year' in req.query;

  if (requiredParamsPresent) {

    where[Op.and] = [
      { brand: req.query.brand },
      { model: req.query.model },
      { year: req.query.year },
      { available: true },
    ];
    include = [
      {
        model: Reservation,
        required: false, // To perform a LEFT JOIN instead of INNER JOIN
        where: { vehicle_id: null }, // Check if the vehicle is not reserved
      },
    ];
  } else {
    throw new Error('Incorrect request data: some fields are missing');
  }
  const vehicles = await Vehicle.findAll({ where, include });
  if (vehicles.length === 0) {
    return Promise.reject(new Error('No vehicles available of said model'));
  }
  res.json(vehicles);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };