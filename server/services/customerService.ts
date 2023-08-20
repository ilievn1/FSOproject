const { Customer } = require('../models');

interface Props {
    name: string;
    username: string;
    hashedPassword: string;
}

const addCustomer = async (props: Props) => {
  const { name, username, hashedPassword } = props;

  const newCustomer = await Customer.create({ name, username, hashedPassword });

  return newCustomer;
};

export default {
  addCustomer
};