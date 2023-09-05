import { data } from '../mockData/locations';
import { DateRange, NewFeedback, NewInquiry, NewReservation, Rating, Vehicle } from '../types';
import { Vehicle as VehicleModel, Reservation as ReservationModel } from '../models';
import { NoAvailableVehiclesError, DateRangeError } from './errors';

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

const parseDate = (date: unknown): string => {
  if (!isString(date) || !Date.parse(date)) {
    throw new Error(`Incorrect date: ${date}`);
  }
  return date;
};

const isWithinAMonth = (startDate: Date, endDate: Date): boolean => {
  const oneMonthLater = new Date(startDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  return endDate <= oneMonthLater;
};

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

const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  const currentDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return currentDate >= start && currentDate <= end;
};

const isVehicleFree = (vehicle: Vehicle, requestedDateRange: DateRange): boolean => {
  console.log('===Checking vehicle isVehicleFree===\n',vehicle);
  if (!vehicle.reservations) {
    return true; // No reservations, vehicle is free.
  }

  // Check if any reservation overlaps with the given date range.
  return !vehicle.reservations.some(reservation =>
    isDateInRange(requestedDateRange.rentDate, reservation.rentDate, reservation.returnDate) ||
    isDateInRange(requestedDateRange.returnDate, reservation.rentDate, reservation.returnDate)
  );
};

const findAvailableVehicle = (vehicles: Vehicle[], requestedDateRange: DateRange): Vehicle => {
  console.log('===Checking if all vehicles of said model===\n',vehicles);
  for (const vehicle of vehicles) {
    if (isVehicleFree(vehicle, requestedDateRange)) {
      return vehicle;
    }
  }
  throw new NoAvailableVehiclesError('No free vehicle of said model for that date range');
};



const toNewReservation = async (object: unknown): Promise<NewReservation> => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.body object');
  }
  const requiredParamsPresent =
    'brand' in object &&
    'model' in object &&
    'year' in object &&
    'customerId' in object &&
    'rentDate' in object &&
    'pickUpLocationId' in object &&
    'returnDate' in object &&
    'dropOffLocationId' in object;

  if (requiredParamsPresent) {

    const rentDate = parseDate(object.rentDate);
    const returnDate = parseDate(object.returnDate);

    if (!isWithinAMonth(new Date(rentDate), new Date(returnDate))) {
      throw new DateRangeError('Rent and return date must be at most a month apart');
    }

    const vehiclesByCriteria = await VehicleModel.findAll({
      include: [
        {
          model: ReservationModel,
          required: false, // This allows vehicles with no reservations to be included
        },
      ], where: {
        brand: parseString(object.brand),
        model: parseString(object.model),
        year: parseYear(object.year),
        available: true,
      }
    });

    const vehicle = findAvailableVehicle(JSON.parse(JSON.stringify(vehiclesByCriteria)), { rentDate, returnDate });

    const params: NewReservation = {
      vehicleId: vehicle.id,
      customerId: parseId(object.customerId),
      rentDate: rentDate,
      pickUpLocationId: parseLocation(object.pickUpLocationId),
      returnDate: returnDate,
      dropOffLocationId: parseLocation(object.dropOffLocationId),
    };

    return params;

  } else {
    throw new Error('Incorrect data: expected field are brand, model, year, customerId, rentDate, pickUpLocationId, returnDate and dropOffLocationId');
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

const toDeleteParams = (object: unknown) => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data - Expected req.params object');
  }
  const requiredParamsPresent = 'customerId' in object && 'reservationId' in object;
  if (requiredParamsPresent) {
    const params = {
      customerId: parseId(object.customerId),
      reservationId: parseId(object.reservationId),
    };

    return params;

  } else {
    throw new Error('Incorrect data: req.params expected fields are customerId and reservationId');
  }
};

export default { toSearchParams, toNewReservation, toNewFeedback, toNewInquiry, toDeleteParams };