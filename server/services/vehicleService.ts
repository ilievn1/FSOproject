import { DateRange } from '../types';

const { Vehicle, Reservation } = require('../models');
const _ = require('lodash');


const getAllVehicles = async () => {
  const vehicles = await Vehicle.findAll({ where: { available: true } });

  return vehicles;
};
interface SeachParamsProps {
  brand: string;
  model: string;
  year: number;
}
const getCommonDatesInRanges = (dateRanges: DateRange[], vehiclesCount: number): string[] => {
  // Step 1: Create an array of arrays containing all dates between rentDate and returnDate
  const datesArrays = dateRanges.map((range) => {
    const startDate = new Date(range.rentDate);
    const endDate = new Date(range.returnDate);
    const dates = [];

    const currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(startDate.toISOString().split('T')[0]);
      currentDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  });

  console.log('dateArrays', datesArrays);
  // Step 2: Check how many times a date occurs.
  // If === vehiclesCount, then all vehicles of said brand/model/year are occupied on that date
  const dateCounts = new Map<string, number>();

  // Count the occurrences of each date
  for (const dateArray of datesArrays) {
    for (const date of dateArray) {
      if (dateCounts.has(date)) {
        dateCounts.set(date, dateCounts.get(date)! + 1);
      } else {
        dateCounts.set(date, 1);
      }
    }
  }

  const occupiedDatesForAllVehicles = [];
  for (const [date, count] of dateCounts) {
    if (count === vehiclesCount) {
      occupiedDatesForAllVehicles.push(date);
    }
  }

  console.log('occupiedDatesForAllVehicles', occupiedDatesForAllVehicles);
  return occupiedDatesForAllVehicles;
};

const vehicleNonAvailableDates = async (params: SeachParamsProps) => {
  const { brand, model, year } = params;

  const occupiedDateRanges = await Reservation.findAll({
    include: [
      {
        model: Vehicle,
        where: {
          brand: brand,
          model: model,
          year: year,
          available:true
        },
        attributes: ['id'],

      },
    ],
    attributes: ['rentDate', 'returnDate'],

  });
  const JSONDateRanges = JSON.parse(JSON.stringify(occupiedDateRanges));

  console.log('occupied dates (From DB) for certain brand/model/year\n', JSONDateRanges);
  /* If one vehicle of said brand/model/year exists in DB,
  it won't have common dates with other vehicles of same brand/model/year
  If more than one exists in DB, then we get common dates.
  */
  const isOneVehicle = _.every(JSONDateRanges, (obj: { rentDate: string, returnDate: string, vehicle: { id: number } }) => obj.vehicle.id === JSONDateRanges[0].vehicle.id);

  if (isOneVehicle) {
    /* use individual ranges to create datesArray,
    after which flatten to get all dates b/w all ranges*/
    const allDates = JSONDateRanges.flatMap((obj: { rentDate: string, returnDate: string, vehicle: { id: number } }) => {

      const rentDate = new Date(obj.rentDate);
      const returnDate = new Date(obj.returnDate);
      const currentDate = rentDate;

      const allDatesBetweenSingleRange = [];
      while (rentDate <= returnDate) {
        allDatesBetweenSingleRange.push(rentDate.toISOString().split('T')[0]);
        currentDate.setDate(rentDate.getDate() + 1);
      }

      return allDatesBetweenSingleRange;
    });

    return allDates;
  } else {
    const vehiclesCount = _.uniqBy(JSONDateRanges, 'vehicle.id').length;
    console.log('vehiclesCount', vehiclesCount);
    return getCommonDatesInRanges(JSONDateRanges, vehiclesCount);
  }
};

const getTopThreeByRating = async () => {
  const topRated = await Vehicle.findAll({
    where: { available: true },
    order: [['rating', 'DESC']],
    limit: 3
  });
  return topRated;
};

export default {
  getAllVehicles,
  vehicleNonAvailableDates,
  getTopThreeByRating
};