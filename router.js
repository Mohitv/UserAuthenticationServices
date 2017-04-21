const Authentication = require('./controllers/authentication');

const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const facebookAuth = passport.authenticate('facebook', { session: false });
//const facebookRedirect = passport.authenticate('facebook', { session: false });

module.exports = function (app) {
  //API calls to local parking application
  app.get('/', requireAuth, function (req, res) {
    res.send({ message: 'Super secret code is ABC123' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  app.get('/auth/facebook', facebookAuth);
  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get("/auth/facebook/callback", facebookAuth, Authentication.signin);

  app.get('/logout', function (req, res) {
    req.logout();
    next();
  });

}
