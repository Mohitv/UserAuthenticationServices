const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { console.log("no user"); return done(null, false); }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  console.log("Payload Sub: " + payload.sub);
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//Create Facebook strategy
const facebookOptions = {
  clientID: "1694958553862518",
  clientSecret: "ccd7464a6317e6f5d945b15c566c452e",
  callbackURL: "/auth/facebook/callback"
};

const facebookLogin = new FacebookStrategy(facebookOptions,
  function (accessToken, refreshToken, profile, done) {
    console.log("Inside facebook strategy");
    User.findOrCreate(
      { facebookId: profile.id },
      function (err, result) {
        if (result) {
          result.access_token = accessToken;
          result.save(function (err, user) {
            done(null, user);
          });
        }
        else {
          done(null, false);
        }
      }
    );
  });

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);
