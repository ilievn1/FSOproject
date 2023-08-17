const { Customer, Reservation, Feedback } = require('../models/');

const customersInDB = async () => {
  const customers = await Customer.findAll();
  return JSON.stringify(customers);
};
const customerByUsername = async (username: string) => {
  const matchedCustomer = await Customer.findOne({
    where: {
      username
    }
  });
  return JSON.stringify(matchedCustomer);
};
const allReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [{ model: Customer }],
    where: {
      '$username$': username,
    }
  });
  return JSON.stringify(customerReservations);
};
const activeReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [{ model: Customer }],
    where: {
      endAt: null,
      '$username$': username
    }
  });
  return JSON.stringify(customerReservations);
};

const nonRatedReservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    include: [{ model: Customer }, { model: Feedback }],
    where: {
      '$username$': username,
      '$feedback$': null,

    }
  });
  return JSON.stringify(customerReservations);
};

module.exports = {
  customersInDB,
  customerByUsername,
  allReservationsByUsername,
  activeReservationsByUsername,
  nonRatedReservationsByUsername
};