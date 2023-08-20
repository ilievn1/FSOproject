const { Vehicle, Reservation } = require('../models');
interface SeachParamsProps {
    brand: string;
    model: string;
    year: number;
}

const getRentableVehicle = async (params: SeachParamsProps) => {
  const { brand, model, year } = params;
  /* If vehicle has active reservation it will be included in the 'reservation' column
    Since only vehicles with 'reservation': null are returned as rentable,
    vehicles with active reservation will be ignored, as they are in use by other customers
  */
  const include = [
    {
      model: Reservation,
      required: false, // This allows vehicles with no reservations to be included
      where: {
        endAt: null
      },
    },
  ];
  const where = {
    brand: brand,
    model: model,
    year: year,
    available: true,
    '$reservation$': null,
  };
  const toBeRented = await Vehicle.findOne({ include, where });

  return toBeRented;
};

export default {
  getRentableVehicle,
};