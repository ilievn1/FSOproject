const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable('locations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[0-9]{10}$/,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      }
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable('locations');
  }
};
