import { NewCustomer, NewFeedback, Rating } from '../types';


const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

const isNumber = (text: unknown): text is number => {
  return !isNaN(Number(text));
};

const parseId = (id: unknown): number => {
  if (!isNumber(id)) {
    throw new Error('Incorrect id format');
  }
  return Number(id);

};
const isRating = (param: number): param is Rating => {
  return [1, 2, 3, 4, 5].includes(param);

};

const parseRating = (rating: unknown): Rating => {
  if (!isNumber(rating) || !isRating(rating)) {
    throw new Error('Incorrect rating format - must be integer between 1 and 5');
  }
  return rating;

};

// const parseDate = (date: unknown): string => {
//   if (!isString(date) || !Date.parse(date)) {
//     throw new Error(`Incorrect date: ${date}`);
//   }
//   return date;
// };

const parseString = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error('Incorrect string format');
  }
  return text;

};
const parseYear = (year: unknown): number => {
  if (isNaN(Number(year))) {
    throw new Error('Incorrect year format');
  }
  return Number(year);

};

const parsePassword = (password: unknown): string => {
  if (!isString(password)) {
    throw new Error('Password must be a string');
  }

  if (password.length < 5) {
    throw new Error('Password is below 5 characters');
  }

  return password;
};

interface SearchParams {
    brand: string;
    model: string;
    year: number;
}
const toSearchParams = (object: unknown): SearchParams => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.query object');
  }
  const requiredParamsPresent = 'brand' in object && 'model' in object && 'year' in object;
  if (requiredParamsPresent) {
    const params: SearchParams = {
      brand: parseString(object.brand),
      model: parseString(object.model),
      year: parseYear(object.year),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.query expected fields are brand, model and year');
  }
};

const toNewCustomer = (object: unknown): NewCustomer => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  const requiredParamsPresent = 'name' in object && 'username' in object && 'password' in object;
  if (requiredParamsPresent) {
    const params: NewCustomer = {
      name: parseString(object.name),
      username: parseString(object.username),
      password: parsePassword(object.password),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.body expected fields are name, username and password');
  }
};

const toNewReservation = (object: unknown) => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  if ('vehicleId' in object) {
    const params = {
      vehicleId: parseId(object.vehicleId),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.body expected field is vehicleId');
  }
};

const toNewFeedback = (object: unknown): NewFeedback => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  const requiredParamsPresent = 'reservationId' in object && 'rating' in object;
  if (requiredParamsPresent) {
    const params: NewFeedback = {
      reservationId: parseId(object.reservationId),
      rating: parseRating(object.rating),
      comment: 'comment' in object ? parseString(object.comment) : undefined,
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.body expected fields are reservationId and rating');
  }
};

export default { toSearchParams, toNewCustomer, toNewReservation, toNewFeedback };