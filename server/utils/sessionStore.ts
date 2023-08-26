import redisClient from './redis';

const RedisStore = require('connect-redis').default;

const sessionStore = new RedisStore({
  client: redisClient,
});

export default sessionStore;