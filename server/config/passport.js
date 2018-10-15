import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
import db from '../models/db';

// const User = require('../models/User');
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

// module.exports = (passport) => {
//     passport.use(new JwtStrategy(opts,  (jwt_payload, done) => {
//         db.user.map((user) => {
//             if (user.email === email) {
//               exist = true;
//               userData = user;
//               return user;
//             }
//           });
        
//           if (exist === false) {
//             return res.status(404).json({ email: 'User Not Found' });
//           }

        // User.findById(jwt_payload.id)
        // .then(user => {
        //     if(user){
        //         return done(null, user);
        //     }else{
        //         return done(null, false);
        //     }
//         })
//         .catch(err => console.log(err));
//   })
        // });
    // };
