
import express from 'express';
import passport from 'passport';
const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google' }),     // Failed authentication, force reattempt login.

  (req, res) => {
    console.log('======= Successfully auth\'d /api/auth/google/callback redirect =======\n');

    console.log('Object.keys(req):\n', Object.keys(req));
    console.log('Contents of req.user:\n', req.user);

    res.redirect('http://localhost:5173?authenticated=true');

  });

authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('http://localhost:5173');
  });
});


export default authRouter;
