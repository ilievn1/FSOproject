import { RequestHandler, ErrorRequestHandler } from 'express';

const unknownEndpoint: RequestHandler = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _request, _response, next) => {
  // console.error(error.name);
  // console.error(Object.keys(error));
  // console.error(Object.entries(error));
  // console.error(error.parent.table);
  // console.error(error.fields.username);
  // if (error.name === 'SequelizeUniqueConstraintError' && error.parent.table ==='customers') {
  //   response.status(409).send({ error: `Username ${error.fields.username} is taken` });
  // }
  console.error(error.message);
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler
};