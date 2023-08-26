import redisClient from './redis';

const RedisStore = require('connect-redis').default;

const sessionStore = new RedisStore({
  client: redisClient,
  ttl: 7200
});

export default sessionStore;