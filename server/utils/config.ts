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
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
};