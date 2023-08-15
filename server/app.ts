import express, { Request } from 'express';
import morgan from 'morgan';
import _ from 'underscore';
const cors = require('cors');
require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');
const { Vehicle } = require('./models');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/vehicles', async (req, res) => {
  if (_.isEmpty(req.query)) {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } else {
    const requiredParamsPresent = 'brand' in req.query && 'model' in req.query && 'year' in req.query;
    if (requiredParamsPresent){
      await Vehicle.findOne({
        where: {
          brand: req.query.brand,
          model: req.query.model,
          year: req.query.year,
          available: true
        }
      });
    }
    throw new Error('Incorrect request data: some fields are missing');

  }
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };