import { Op } from 'sequelize';
const bcrypt = require('bcrypt');
const { Vehicle, Customer, Reservation, Feedback } = require('../models/');

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

const createReservation = async (customerId: number, vehicleId: number) => {

  const newReservation = await Reservation.create({
    vehicleId: vehicleId,
    customerId: customerId,
    startAt: new Date().toJSON().slice(0, 10)
  });

  return newReservation.toJSON();
};
const endReservation = async (reservationId: number) => {
  await Reservation.update({ endAt: new Date().toJSON().slice(0, 10) }, {
    where: {
      id: reservationId
    }
  });
};
const createCustomer = async (name: string, username: string) => {
  const newCustomer = await Customer.create({
    name: name,
    username: username,
    hashedPassword: await bcrypt.hash('password', 10)
  });

  return newCustomer.toJSON();
};
const toggleVehicleAvailability = async (vehicleId: number, available: boolean) => {
  await Vehicle.update({ available: available }, {
    where: {
      id: vehicleId
    }
  });
};

module.exports = {
  toggleVehicleAvailability,
  customersInDB,
  customerByUsername,
  createCustomer,
  createReservation,
  endReservation,
  allReservationsByUsername,
  activeReservationsByUsername,
  nonRatedReservationsByUsername,
  ratedReservationsByUsername,
};