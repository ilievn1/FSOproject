import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import vehiclesRouter from './routes/vehicles';
import customersRouter from './routes/customers';
import inquiriesRouter from './routes/inquiries';

require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/inquiries', inquiriesRouter);
//   // TODO: Add query param extractor middleware (extraction, request proofing)
//   // TODO: Extract DB communication to service
//   // TODO: Extract to router
//   let where = {};
//   let include: Array<object> = [];
//   const requiredParamsPresent = 'brand' in req.query && 'model' in req.query && 'year' in req.query;

//   /* If vehicle has active reservation it will be included in the 'reservation' column
//     Since only vehicles with 'reservation': null are returned as rentable,
//     vehicles with active reservation will be ignored, as they are in use by other customers
//   */
//   if (requiredParamsPresent) {
//     include = [
//       {
//         model: Reservation,
//         required: false, // This allows vehicles with no reservations to be included
//         where: {
//           endAt: null
//         },
//       },
//     ];
//     where = {
//       brand: req.query.brand,
//       model: req.query.model,
//       year: req.query.year,
//       available: true,
//       '$reservation$': null,
//     };
//   }
//   const toBeRented = await Vehicle.findOne({ include, where });

//   if (!toBeRented) {
//     return res.status(404).send({ error: 'No vehicles available of said model' });
//   }
//   return res.json(toBeRented);
// });

// app.post('/api/customers', async (req, res) => {
//   // TODO: Add query param extractor middleware (extraction, request proofing)
//   // TODO: Extract to error handling to middleware - upon create fail, customer not created, rather exception handled directly to errorHandler
//   // TODO: Extract DB communication to service
//   // TODO: Extract to router
//   if (req.body.password.length < 5) {
//     return res.status(403).send({ error: 'Password is below 5 characters' });
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newCustomer = await Customer.create({ name: req.body.name, username: req.body.username, hashedPassword });
//     return res.status(201).json(newCustomer.toJSON());
//   } catch (err) {
//     return res.status(409).send({ error: `Username ${req.body.username} is taken` });
//   }

// });
// // TODO: Add query param extractor middleware (extraction, request proofing)
// // TODO: Extract to error handling to middleware
// // TODO: Extract DB communication to service
// // TODO: Extract to router

// app.get('/api/customers/:id/reservations', async (req, res) => {
//   const customerReservations = await Reservation.findAll({
//     include: [{ model: Feedback }],
//     where: {
//       customerId: req.params.id,
//       [Op.or]: [
//         {
//           endAt: null
//         },
//         {
//           '$feedback$': null,
//         }
//       ]
//     },
//   });
//   res.json(customerReservations);
// });

// app.post('/api/customers/:id/reservations', async (req, res) => {
//   const newReservation = await Reservation.create(req.body);
//   res.status(201).json(newReservation);
// });

// app.put('/api/customers/:cId/reservations/:rId', async (req, res) => {
//   const toBeEnded = await Reservation.findOne({
//     where: {
//       id: req.params.rId,
//       customerId: req.params.cId,
//     },
//   });
//   toBeEnded.endAt = new Date().toJSON().slice(0, 10);
//   await toBeEnded.save();
//   res.json(toBeEnded);
// });

// app.post('/api/customers/:cId/reservations/:rId/feedback', async (req, res) => {
//   const newReservation = await Feedback.create(
//     {
//       reservationId: req.params.rId,
//       ...req.body
//     }
//   );
//   res.status(201).json(newReservation);
// });

// app.post('/api/inqueries', async (req, res) => {
//   await Inquery.create(
//     {
//       ...req.body
//     }
//   );
//   res.status(201);
// });

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };