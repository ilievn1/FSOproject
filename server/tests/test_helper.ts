const { Customer } = require('../models/');

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
const customerByName = async (name: string) => {
  const matchedCustomer = await Customer.findOne({
    where: {
      name
    }
  });
  return JSON.stringify(matchedCustomer);
};

module.exports = {
  customersInDB,
  customerByUsername,
  customerByName
};