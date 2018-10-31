'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

var _users = require('../validation/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
// import db from '../models/mockdb';


/* eslint-disable import/first */


// Load Input validation


const { SECRET_OR_KEY } = process.env;
class usersController {
  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/users/register
   * @description This function implements the logic for registering a new user.
   * @access Private
   */
  static signup(req, res) {
    const { errors, isValid } = _users2.default.validateSignupInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      email, password, name, type
    } = req.body;
    const userexist = 'SELECT * FROM users WHERE email = $1';
    const userexistqueryvalue = [email];
    _db2.default.query(userexist, userexistqueryvalue).then(dbresponse => {
      if (dbresponse.rows[0]) {
        return res.status(409).json({ email: 'Email Already Exist' });
      }

      const data = {
        email,
        password,
        name,
        status: 1,
        type,
        userImage: 'uploads\\users\\default-avatar.png'
      };

      _bcryptjs2.default.genSalt(10, (err, salt) => {
        // Check if there is error generating salt
        if (err) {
          return res.status(400).json({ message: 'Error Creating User, Try again ' });
        }

        _bcryptjs2.default.hash(data.password, salt, (error, hash) => {
          if (error) throw error;
          data.password = hash;
          const text = `INSERT INTO
        users(id, name, email, password, type, status, userImage, created_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        returning *`;
          const values = [(0, _v2.default)(), data.name, data.email, data.password, data.type, data.status, data.userImage, new Date()];

          _db2.default.query(text, values).then(dbres => {
            return res.status(201).json({ message: 'User Created Successfully', data: dbres.rows[0] });
          }).catch(() => {
            /* istanbul ignore next */
            return res.status(400).json({ message: 'Error creating user, Please try again' });
          });
        });
      });
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error creating user, Please try again' });
    });
  }

  /**
   * Login Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/users/login
   * @description This function implements the logic to loggin a user.
   * @access Public
   */
  static login(req, res) {
    const { errors, isValid } = _users2.default.validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { email, password } = req.body;

    const userexist = 'SELECT * FROM users WHERE email = $1';
    const userexistqueryvalue = [email];
    _db2.default.query(userexist, userexistqueryvalue).then(dbresponse => {
      if (!dbresponse.rows[0]) {
        return res.status(404).json({ email: 'User Not Found' });
      }

      const userData = dbresponse.rows[0];
      _bcryptjs2.default.compare(password, userData.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            type: userData.type
          };
          // Sign Token
          _jsonwebtoken2.default.sign(payload, SECRET_OR_KEY, { expiresIn: 3600 }, (err, token) => {
            res.json({ success: true, token: `Bearer ${token}` });
          });
        } else {
          return res.status(401).json({ password: 'Incorrect Password' });
        }
      });
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Logging in user, Please try again' });
    });
  }

  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/users/current
   * @description This function implements the logic for getting the current user
   * details with token parsed.
   * @access Private
   */
  static getCurrentUser(req, res) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
}

exports.default = usersController;