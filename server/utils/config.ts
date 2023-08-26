require('dotenv').config();

let DATABASE_URL;

switch (process.env.NODE_ENV) {
case 'development': {
  DATABASE_URL = process.env.DEV_DATABASE_URL;
  break;
}
case 'test':{
  DATABASE_URL = process.env.TEST_DATABASE_URL;
  break;
}
case 'production':{
  DATABASE_URL = process.env.PROD_DATABASE_URL;
  break;
}
}

module.exports = {
  DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  REDIS_URL: process.env.REDIS_URL
};