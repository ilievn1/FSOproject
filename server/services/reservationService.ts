import { Op } from 'sequelize';

const { Reservation, Feedback } = require('../models');

const getCustomerReservations = async (id: string | number) => {
  const reservations =
        await Reservation.findAll({
          include: [{ model: Feedback }],
          where: {
            customerId: id,
            [Op.or]: [
              {
                endAt: null
              },
              {
                '$feedback$': null,
              }
            ]
          },
        });

  return reservations;
};

interface Props {
  vehicleId: number;
  customerId: number;
  startAt: string;
}

const addCustomerReservation = async (props: Props) => {

  const newReservation = await Reservation.create(props);

  return newReservation;
};

const endCustomerReservation = async (rId: string, cId: string) => {

  const toBeEnded = await Reservation.findOne({
    where: {
      id: rId,
      customerId: cId,
    },
  });
  toBeEnded.endAt = new Date().toJSON().slice(0, 10);
  await toBeEnded.save();

  return toBeEnded;
};
export default {
  getCustomerReservations, addCustomerReservation, endCustomerReservation
};