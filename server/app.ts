import express, { Request } from 'express';
import morgan from 'morgan';
const cors = require('cors');
require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');
const { Vehicle } = require('./models');
const { Reservation } = require('./models');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/vehicles', async (req, res) => {
  let where = {};
  let include: Array<object> = [];
  const requiredParamsPresent = 'brand' in req.query && 'model' in req.query && 'year' in req.query;

  if (requiredParamsPresent) {

    where = {
      brand: req.query.brand,
      model: req.query.model,
      year: req.query.year,
      available: true,
      '$reservation$': null,

    };
    include = [
      {
        model: Reservation,
      },
    ];
  }
  const vehicles = await Vehicle.findAll({ include, where });
  console.log('Vehicles with valid params after retrieval', JSON.stringify(vehicles));
  if (vehicles.length === 0) {
    res.status(404).send({ error: 'No vehicles available of said model' });
  }
  res.json(vehicles);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };