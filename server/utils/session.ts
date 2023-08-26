import sessionStore from './sessionStore';

const config = {
  secret: process.env.SECRET!,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 60 * 60 * 2 * 1000, // 2 hours or 7200 * 1000 ms
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false
  }
};

export default config;