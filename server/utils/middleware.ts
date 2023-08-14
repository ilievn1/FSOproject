import { RequestHandler, ErrorRequestHandler, Request, Response } from 'express';

const morgan = require('morgan');

const requestLogger = () => {
  morgan.token('body', (request: Request, _response: Response) => JSON.stringify(request.body));

  return morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]');
};

const unknownEndpoint: RequestHandler = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _request, _response, next) => {
  console.error(error.message);
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};