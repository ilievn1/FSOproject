import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import vehiclesRouter from './routes/vehicles';
import customersRouter from './routes/customers';
import inquiriesRouter from './routes/inquiries';
import authRouter from './routes/auth';
import session from 'express-session';
import passport from 'passport';
import expressSessConfig from './utils/session';
import configurePassport from './utils/passport';
import sessionStore from './utils/sessionStore';

configurePassport(passport);
require('dotenv').config();

require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  morgan.token('body', (req: Request) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
}

// TODO: redis config to its own file
// TODO: clear all printing middlewares + console.log statements from google strat, /api/auth handlers
// TODO: correct all redirects
// TODO: serialize only import info in cookie
// TODO: remove signups (post req) from /api/customer and unnecessary req. proofing
// TODO: update customer model
// TODO: fix api tests to test vehicle.all retrieval and set app to conditionally use auth - env=test does not use auth middlewares - only tests api functionality
// TODO: write E2E tests to test auth functionality
// TODO: add conditional https secure cookie when deployed

app.use(session(expressSessConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.headerLogger);
app.get('/allSess', (_req, resp) => {
  sessionStore.all((_err: unknown, sessions: session.SessionData[] | { [sid: string]: session.SessionData; } | null | undefined) => resp.json(sessions));
  resp.redirect('/allSess');

});
app.get('/clearSess', (_req, resp) => {
  sessionStore.clear((err: unknown) => console.error(err));
  resp.redirect('/allSess');
});
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/auth', authRouter);
app.use(middleware.checkAuth);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/customers', customersRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
export { };