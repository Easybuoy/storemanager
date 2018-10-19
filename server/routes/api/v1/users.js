import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import keys from '../../../config/keys';

import db from '../../../models/db';
// Load Input validation
import usersValidation from '../../../validation/users';


const router = express.Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = usersValidation.validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {
    email, password, name, type,
  } = req.body;
  let exist = false;
  db.user.map((user) => {
    if (user.email === email) {
      exist = true;
      return exist;
    }
  });
  if (exist) {
    return res.status(409).json({ email: 'Email Already Exist' });
  }

  let id = db.user.length;
  id += 1;

  const data = {
    id,
    email,
    password,
    name,
    status: 1,
    type,
    date_time: new Date(),
  };

  bcrypt.genSalt(10, (err, salt) => {
    // Check if there is error generating salt
    if (err) {
      return res.status(500).json({ message: 'Error Creating User, Try again ' });
    }

    bcrypt.hash(data.password, salt, (error, hash) => {
      if (error) throw error;
      data.password = hash;
      db.user.push(data);
      res.status(201).json({ message: 'User Created Successfully', data });
    });
  });
});


// @route   POST api/users/register
// @desc     Login user / Returning JWT Token
// @access   Public
router.post('/login', (req, res) => {
  const { errors, isValid } = usersValidation.validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let exist = false;
  let userData = {};
  const { email, password } = req.body;
  db.user.map((user) => {
    if (user.email === email) {
      exist = true;
      userData = user;
      return user;
    }
  });

  if (exist === false) {
    return res.status(404).json({ email: 'User Not Found' });
  }

  bcrypt.compare(password, userData.password)
    .then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        };
        // Sign Token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: `Bearer ${token}` });
        });
      } else {
        return res.status(401).json({ password: 'Incorrect Password' });
      }
    });
});


// @route   GET api/users/current
// @desc     Return current user
// @access   Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});


module.exports = router;
