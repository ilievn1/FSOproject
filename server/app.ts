import express, { Request } from 'express';
import morgan from 'morgan';
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

app.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});
app.get('/api/vehicles', async (_req, res) => {
  const vehicles = await Vehicle.findAll();
  console.log(vehicles);
  res.json(vehicles);
});
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };