import express, { Request } from 'express';
import morgan from 'morgan';
const cors = require('cors');
import vehiclesRouter from './routes/vehicles';
import customersRouter from './routes/customers';
import inquiriesRouter from './routes/inquiries';
import authRouter from './routes/auth';
import session from 'express-session';
import passport from 'passport';
import expressSessConfig from './utils/session';
import configurePassport from './utils/passport';
import locationsRouter from './routes/locations';

const { NODE_ENV } = require('./utils/config');
require('express-async-errors');
configurePassport(passport);
const { CLIENT_URL } = require('./utils/config');

const app = express();
const middleware = require('./utils/middleware');

app.use(cors({ credentials: true, origin: CLIENT_URL }));

app.use(express.static('build'));
app.use(express.json());

if (NODE_ENV !== 'production') {
  morgan.token('body', (req: Request) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
}

// TODO: fix api tests to test vehicle.all retrieval and remove tests that involve user creation

// TODO: clear all printing middlewares + console.log statements from google strat, /api/auth handlers
// TODO: clear customer creation services + routes

/*session mw takes care of setting generating sessID, setting sID in the cookie header and propagating sess into the store,
additionally it appends some methods and vars to req headers that ease the verification process */
app.use(session(expressSessConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.headerLogger);

app.use('/api/inquiries', inquiriesRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/auth', authRouter);


if (NODE_ENV !== 'test') {
  app.use(middleware.checkAuth);
}

app.use('/api/customers', customersRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };