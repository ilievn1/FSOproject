import { PassportStatic } from 'passport';
import Google from 'passport-google-oauth20';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('./config');
const { Customer } = require('../models');


const GoogleStrategy = Google.Strategy;

export default function configurePassport(passport : PassportStatic) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  async (_accessToken, _refreshToken, profile, done) => {
    console.log('===== GOOGLE PROFILE =======\n');
    console.log(profile);
    console.log('======== END ===========\n');

    const newCustomer = {
      googleId: profile.id,
      username: `${profile.displayName}${profile.id.substring(0,4)} `,
      name: profile._json.name,
      email: profile._json.email,
      picture: profile._json.picture,
    };

    const result = await Customer.findOrCreate({
      where: { googleId: profile.id },
      defaults: newCustomer
    });

    console.log('Customer.findOrCreate() result:\n', result[0].toJSON());
    done(null, result[0].toJSON());
  }

  ));

  /* passport takes care of setting session data and decrypting it on incoming auth'ed req */
  passport.serializeUser((user, done) => {
    console.log('================serializeUser================\n', user);
    process.nextTick(() => done(null, user));
  });
  passport.deserializeUser((user: Express.User, done) => {
    console.log('================deserializeUser================\n', user);
    process.nextTick(() => done(null, user));
  });
}