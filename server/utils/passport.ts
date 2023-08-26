import Google from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { PassportStatic } from 'passport';
const { Customer } = require('../models');

dotenv.config({ path: resolve(__dirname, '../.env') });
const GoogleStrategy = Google.Strategy;

export default function configurePassport(passport : PassportStatic) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
  },
  async (_accessToken, _refreshToken, profile, done) => {
    console.log('===== GOOGLE PROFILE =======\n');
    console.log(profile);
    console.log('======== END ===========\n');
    // const newCustomer = {
    //   googleId: profile.id,
    //   username: profile.displayName,
    //   name: profile._json.name,
    //   email: profile._json.email,
    //   picture: profile._json.picture,
    // };
    // const result = await Customer.findOrCreate({
    //   where: { googleId: profile.id },
    //   defaults: newCustomer
    // });
    // done(null, result[0]);
    const result = await Customer.findOrCreate({
      where: {
        username: 'testiuseri1'
      },
      defaults: {
        username: 'testiuseri1',
        name: 'testi',
        hashedPassword: '$2b$10$4HHl4dLFffpBT/6zpasUWuCEGWrwQYurIMuKdXiKs94szPpTz2fmS'
      }
    });
    console.log('result', result[0].toJSON());
    done(null, result[0].toJSON());
  }

  ));
  // TODO: as serielized info is in cookie, reduce overhead by storing min needed info to identify user coresponding to ongoing session

  passport.serializeUser((user, done) => {
    console.log('================serializeUser================\n\n', user);
    process.nextTick(() => done(null, { foo: 'bar', ranNmbr: 123 }));
  });
  passport.deserializeUser((obj: Express.User, done) => {
    console.log('================deserializeUser================\n\n', obj);
    process.nextTick(() => done(null, obj));
  });
  // //TODO: Promise to async/await and customer
  // passport.deserializeUser((id, done) => {
  //   User.findById(id).then((user) => {
  //     done(null, user);
  //   });
  // });

// passport.deserializeUser(async (id, done) => {
//         done(null, await User.findById(id))
//     })
}