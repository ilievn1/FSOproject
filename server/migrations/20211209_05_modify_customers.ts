const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.addColumn('customers', 'google_id', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    });
    await queryInterface.addColumn('customers', 'email', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    });
    await queryInterface.addColumn('customers', 'picture', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }

    });
    await queryInterface.removeColumn('customers', 'hashed_password');

  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.removeColumn('customers', 'google_id');
    await queryInterface.removeColumn('customers', 'email');
    await queryInterface.removeColumn('customers', 'picture');
    await queryInterface.addColumn('customers', 'hashed_password', {
      type: DataTypes.STRING,
      allowNull: false
    });
  }
};
