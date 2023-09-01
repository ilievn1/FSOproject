import { Op } from 'sequelize';
const { Reservation, Feedback, Vehicle } = require('../models');
import { NewReservation, Reservation } from '../types';

const getCustomerReservations = async (id: number): Promise<Reservation[]> => {
  const reservations = await Reservation.findAll({
    include: [{ model: Feedback }, { model: Vehicle }, { association: 'pickUpLocation' },{ association: 'dropOffLocation' }],
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

const addCustomerReservation = async (props: NewReservation): Promise<Reservation> => {

  const newReservation = await Reservation.create(props);

  return newReservation;
};

const endCustomerReservation = async (rId: string, cId: string, endDate: string): Promise<Reservation> => {

  const toBeEnded = await Reservation.findOne({
    where: {
      id: rId,
      customerId: cId,
    },
  });
  toBeEnded.endAt = endDate;
  await toBeEnded.save();

  return toBeEnded;
};
export default {
  getAllReservations, getCustomerReservations, addCustomerReservation, endCustomerReservation
};