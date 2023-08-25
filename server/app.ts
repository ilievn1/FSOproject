import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import vehiclesRouter from './routes/vehicles';
import customersRouter from './routes/customers';
import inquiriesRouter from './routes/inquiries';
import authRouter from './routes/auth';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './utils/passport';

configurePassport(passport);

import dotenv from 'dotenv';
dotenv.config();

require('express-async-errors');
const app = express();
const middleware = require('./utils/middleware');

import { createClient } from 'redis';
// Initialize client
const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on('error', (err) => console.error('Could not establish a connection with redis', err));
redisClient.connect();
redisClient.on('connect', () => console.log('Connected to redis successfully'));

const RedisStore = require('connect-redis').default;
const sessionStore = new RedisStore({
  client: redisClient,
  ttl: 7200
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// TODO: Add store - redis, add conditional https secure cookie when deployed
app.use(session({
  secret: process.env.SECRET!,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.headerLogger);
app.get('/allSess', (_req, resp) => {
  sessionStore.all((_err: unknown, sessions: session.SessionData[] | { [sid: string]: session.SessionData; } | null | undefined) => resp.json(sessions));
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