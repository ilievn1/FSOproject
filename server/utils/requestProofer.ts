import { data } from '../mockData/locations';
import { NewFeedback, NewInquiry, Rating } from '../types';
const ALLOWED_LOCATIONS = data;

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

const isNumber = (text: unknown): text is number => {
  return !isNaN(Number(text));
};

const isRating = (param: number): param is Rating => {
  return [1, 2, 3, 4, 5].includes(param);

};

const isLocation = (id: number): boolean => {
  return ALLOWED_LOCATIONS.some((l) => l.id === id);
};


const parseId = (id: unknown): number => {
  if (!isNumber(id)) {
    throw new Error('Incorrect id format');
  }
  return Number(id);
};

const parseRating = (rating: unknown): Rating => {
  if (!isNumber(rating) || !isRating(rating)) {
    throw new Error('Incorrect rating format - must be integer between 1 and 5');
  }
  return rating;

};
const parseInquiry = (inquiry: unknown): string => {
  if (!isString(inquiry) || inquiry.length > 255) {
    throw new Error('Incorrect inquiry format - text max length is 255 characters');
  }
  return inquiry;
};

const parseLocation = (locationId: unknown): number => {
  if (!isNumber(locationId) || !isLocation(locationId)) {
    throw new Error('Invalid location - not in allowed values');
  }
  return locationId;
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

const parsePhoneNumber = (phoneNumber: unknown): string => {
  if (!isString(phoneNumber)) {
    throw new Error('Phone number must be a string');
  }

  if (phoneNumber.length > 13) {
    throw new Error('Phone number is too long');
  }

  if (!/^\+?[0-9]+$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  return phoneNumber;
};

const parseEmail = (email: unknown): string => {
  if (!isString(email)) {
    throw new Error('Email must be a string');
  }

  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email)) {
    throw new Error('Invalid email format');
  }

  return email;
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

const toNewReservation = (object: unknown) => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  const requiredParamsPresent = 'vehicleId' in object && 'pickUpLocationId' in object && 'dropOffLocationId' in object; // && 'customerId' in object && 'startAt' in object

  if (requiredParamsPresent) {
    const params = {
      vehicleId: parseId(object.vehicleId),
      pickUpLocationId: parseLocation(object.pickUpLocationId),
      dropOffLocationId: parseLocation(object.dropOffLocationId),
    };

    return params;

  } else {
    throw new Error('Incorrect data: expected field are vehicleId, customerId, startAt, pickUpLocationId and dropOffLocationId');
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

const toNewInquiry = (object: unknown): NewInquiry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  const requiredParamsPresent = 'name' in object && 'phone' in object && 'email' in object && 'inquiry' in object;
  if (requiredParamsPresent) {
    const params: NewInquiry = {
      name: parseString(object.name),
      phone: parsePhoneNumber(object.phone),
      email: parseEmail(object.email),
      inquiry: parseInquiry(object.inquiry),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.body expected fields are name,phone,email and inquiry');
  }
};

export default { toSearchParams, toNewReservation, toNewFeedback, toNewInquiry };