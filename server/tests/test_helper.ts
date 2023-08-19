import { Op } from 'sequelize';

const { Customer, Reservation, Feedback } = require('../models/');

const customersInDB = async () => {
  const customers = await Customer.findAll();
  return customers.map((c: { toJSON: () => unknown; }) => c.toJSON());
};
const customerByUsername = async (username: string) => {
  const matchedCustomer = await Customer.findOne({
    where: {
      username
    }
  });
  return matchedCustomer.toJSON();
};
const allReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [{
      model: Customer,
      attributes: []
    }],
    where: {
      '$username$': username,
    },
  });
  return customerReservations.map((u: { toJSON: () => unknown; }) => u.toJSON());
};
const activeReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [{ model: Customer }],
    where: {
      endAt: null,
      '$customer.username$': username
    }
  });
  return customerReservations.map((u: { toJSON: () => unknown; }) => u.toJSON());
};

const nonRatedReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [
      {
        model: Customer,
        where: {
          username: username
        },
        attributes: []
      },
      {
        model: Feedback
      }
    ],
    where: {
      endAt: { [Op.not]: null },
      '$feedback$': null,
    }
  });
  return customerReservations.map((u: { toJSON: () => unknown; }) => u.toJSON());
};

const ratedReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [
      {
        model: Customer,
        where: {
          username: username
        },
        attributes: []
      },
      {
        model: Feedback,
        where: {
          reservationId: {
            [Op.col]: 'reservation.id'
          }
        }
      }
    ],
    where: {
      endAt: { [Op.not]: null },
    }
  });
  return customerReservations.map((u: { toJSON: () => unknown; }) => u.toJSON());
};
module.exports = {
  customersInDB,
  customerByUsername,
  allReservationsByUsername,
  activeReservationsByUsername,
  nonRatedReservationsByUsername,
  ratedReservationsByUsername
};