const { Reservation, Feedback, Vehicle } = require('../models');
import { NewReservation, Reservation } from '../types';

const getCustomerReservations = async (id: number): Promise<Reservation[]> => {
  const reservations = await Reservation.findAll({
    include: [{ model: Feedback }, { model: Vehicle }, { association: 'pickUpLocation' }, { association: 'dropOffLocation' }],
    where: {
      customerId: id,
      '$feedback$': null,
    },
  });
  return reservations;
};

const addCustomerReservation = async (props: NewReservation): Promise<Reservation> => {

  const newReservation = await Reservation.create(props);

  return newReservation;
};
const deleteReservationForCustomer = async (reservationId: number) => {
  const newReservation = await Reservation.destroy({
    where: {
      id: reservationId
    }
  });

  return newReservation;
};


export default {
  getCustomerReservations, addCustomerReservation, deleteReservationForCustomer
};