const Sequelize = require('sequelize');
const config = require('./config');
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(config.DATABASE_URL);

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('connected to the database');
  } catch (err) {
    console.log('failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };