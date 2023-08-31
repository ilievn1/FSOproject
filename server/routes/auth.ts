
import express from 'express';
import passport from 'passport';
const { CLIENT_URL } = require('./config');
const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google' }),     // Failed authentication, force reattempt login.

  (req, res) => {
    console.log('======= Successfully auth\'d /api/auth/google/callback redirect =======\n');

    console.log('Object.keys(req):\n', Object.keys(req));
    console.log('Contents of req.user:\n', req.user);

    res.redirect(CLIENT_URL);

  });

authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect(CLIENT_URL);
  });
});


export default authRouter;
