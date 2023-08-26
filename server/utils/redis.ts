import { createClient } from 'redis';
const { REDIS_URL } = require('./config');

// redis[s]://[[username][:password]@][host][:port][/db-number]
const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', function (err) {
  console.error('Could not establish a connection with redis. ', err);
});
redisClient.connect();
redisClient.on('connect', () => {
  console.log('Connected to redis successfully');
});


export default redisClient;