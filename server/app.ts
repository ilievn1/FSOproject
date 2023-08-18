import express, { Request } from 'express';
import morgan from 'morgan';
const cors = require('cors');
const bcrypt = require('bcrypt');

require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');
const { Vehicle, Reservation, Customer } = require('./models');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/vehicles', async (req, res) => {
  // TODO: Add query param extractor middleware (extraction, request proofing)
  // TODO: Extract DB communication to service
  // TODO: Extract to router
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
  if (vehicles.length === 0) {
    res.status(404).send({ error: 'No vehicles available of said model' });
  }
  res.json(vehicles);
});

app.post('/api/customers', async (req, res) => {
  console.log('req.Body', req.body);
  if (req.body.password.length < 5) {
    return res.status(403).send({ error: 'Password is below 5 characters' });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCustomer = await Customer.create({ name: req.body.name, username: req.body.username, hashedPassword });
    return res.status(201).json(newCustomer.toJSON());
  } catch (err) {
    return res.status(409).send({ error: `Username ${req.body.username} is taken` });
  }

});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };