const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(DATABASE_URL);

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
const runSeeding = async () => {
  const seeder = new Umzug({
    migrations: {
      glob: 'seedings/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'seedings' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const seedings = await seeder.up();
  console.log('Seeding up to date', {
    files: seedings.map((seed) => seed.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    await runSeeding();
    console.log('connected to the database');
  } catch (err) {
    console.log('failed to connect to the database \n', err);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };