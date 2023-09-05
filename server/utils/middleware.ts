import { RequestHandler, ErrorRequestHandler } from 'express';
import { Customer } from '../types';
import { DateRangeError, EarlyDeleteError, EarlyFeedbackError, FeedbackToDeletedError, NoAvailableVehiclesError } from './errors';

const checkAuth: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  } else {
    response.status(401).end();
  }
};

const checkOwner: RequestHandler = (request, response, next) => {
  console.log('checkOwner sees url as:\n', request.url);
  const urlAsArray = request.url.split('/').filter(Boolean); // i.e [customers , 67 , reservations...]
  const loggedCustomer = request.user as Customer;
  console.log(urlAsArray);

  if (urlAsArray.length <= 1 ) {
    return next();
  } else if (urlAsArray.length > 1 && !isNaN(Number(urlAsArray[0])) && Number(urlAsArray[0]) === loggedCustomer.id) {
    return next();
  } else {
    response.status(401).end();
  }
};

const headerLogger: RequestHandler = (request, _response, next) => {
  console.log('======= headerLogger START =======\n');
  console.log('request.session\n',request.session);
  console.log('======================================');
  console.log('request.isAuthenticated()\n',request.isAuthenticated());
  console.log('======================================');
  console.log('request.params\n', request.url);
  const urlAsArray = request.url.split('/').filter(Boolean);
  console.log(urlAsArray);
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

  switch (error.constructor) {
  case NoAvailableVehiclesError:
    response.status(404).send({ error: error.message });
    break;

  case DateRangeError:
    response.status(400).send({ error: error.message });
    break;

  case EarlyDeleteError:
  case EarlyFeedbackError:
  case FeedbackToDeletedError:
    response.status(403).send({ error: error.message });
    break;

  default:
    response.status(500).send({ error: 'Internal Server Error' });
  }


  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  checkAuth,
  checkOwner,
  headerLogger
};