import express from 'express';
import cors from 'cors';
const app = express();
const middleware = require('./utils/middleware');


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(middleware.requestLogger);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;