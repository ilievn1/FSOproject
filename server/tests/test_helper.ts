const { Customer, Reservation } = require('../models/');

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
const reservationsByUsername = async (username: string) => {
  const customerReservations = await Reservation.findAll({
    where: {
      username
    }
  });
  return JSON.stringify(customerReservations);
};

module.exports = {
  customersInDB,
  customerByUsername,
  reservationsByUsername
};