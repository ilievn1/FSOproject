import { RequestHandler, ErrorRequestHandler } from 'express';

const checkAuth: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  } else {
    response.redirect('http://localhost:5173');
  }
};

const checkGuest: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    response.redirect('http://localhost:5173');
  } else {
    return next();
  }
};

const headerLogger: RequestHandler = (request, _response, next) => {
  console.log('======= headerLogger START =======\n');
  console.log('Object.keys(request)\n',Object.keys(request));
  console.log('======================================');
  console.log('request.session\n',request.session);
  console.log('======================================');
  console.log('request.sessionID\n', request.sessionID);
  console.log('======================================');
  console.log('request.sessionStore\n', request.sessionStore);
  console.log('======================================');
  console.log('request.isAuthenticated()\n',request.isAuthenticated());
  console.log('======================================');
  console.log('======= headerLogger END =======\n');
  next();
};

const unknownEndpoint: RequestHandler = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  console.error(error.name);
  console.error(error.message);
  // console.error(Object.keys(error));
  // console.error(Object.entries(error));

  if (error.name === 'SequelizeUniqueConstraintError' && error.parent.table ==='customers') {
    response.status(409).send({ error: `Username ${error.fields.username} is taken` });
  }
  if (error.message === 'Incorrect data: req.body expected fields are name, username and password') {
    response.status(422).send({ error: error.message });
  }
  if (error.message === 'Incorrect year format') {
    response.status(400).send({ error: 'Incorrect year format' });
  }
  if (error.message === 'Incorrect data: req.query expected fields are brand, model and year') {
    response.status(400).send({ error: error.message });
  }
  if (error.message === 'Password is below 5 characters') {
    response.status(403).send({ error: error.message });
  }
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  checkAuth,
  checkGuest,
  headerLogger
};