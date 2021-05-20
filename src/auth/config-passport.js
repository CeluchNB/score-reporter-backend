const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

var opts = {};
opts.secretOrKey = process.env.JWT_SECRET;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findByCredentials(email, password);
    if (!user) {
      done('Unable to login');
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
}
));

// TODO: match jwt_payload to jwt in user object for added security
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findOne({ _id: jwt_payload._id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  });
}));