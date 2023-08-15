import { RequestHandler, ErrorRequestHandler } from 'express';

const unknownEndpoint: RequestHandler = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _request, _response, next) => {
  console.error(error.message);
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler
};