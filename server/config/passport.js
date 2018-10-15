import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../models/db';

const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwtpayload, done) => {
    let exist = false;
    let userData = {};
    db.user.map((user) => {
      if (user.email === jwtpayload.email) {
        exist = true;
        userData = user;
        return user;
      }
    });

    if (exist === false) {
      return done(null, false);
    }
    return done(null, userData);
  }));
};
