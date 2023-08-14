const { DataTypes } = require('sequelize');
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable('vehicles', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      car_image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      licence_number: {
        type: DataTypes.STRING(6),
        unique: true,
        allowNull: false,
        validate: {
          is: {
            args: /^[A-Z]{3}-[0-9]{3}$/i,
            msg: 'Licence number must be with format [A-Z][A-Z][A-Z]-[0-9][0-9][0-9]'
          }
        }
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1900
        }
      },
      engine: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transmittion: {
        type: DataTypes.ENUM(['Manual', 'Automatic']),
        allowNull: false
      },
      fuel: {
        type: DataTypes.ENUM(['Diesel', 'Petrol', 'Hybrid']),
        allowNull: false
      },
      fuel_efficiency_city: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      fuel_efficiency_highway: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 2,
          max: 9
        }
      },
      rent_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 5
        }
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable('vehicles');
  }
};
