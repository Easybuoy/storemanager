import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';

/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
// import db from '../models/mockdb';
import db from '../models/db';

// Load Input validation
import usersValidation from '../validation/users';

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
    const { errors, isValid } = usersValidation.validateSignupInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      email, password, name, type,
    } = req.body;
    const userexist = 'SELECT * FROM users WHERE email = $1';
    const userexistqueryvalue = [
      email,
    ];
    db.query(userexist, userexistqueryvalue).then((dbresponse) => {
      if (dbresponse.rows[0]) {
        return res.status(409).json({ email: 'Email Already Exist' });
      }

      const data = {
        email,
        password,
        name,
        status: 1,
        type,
        userImage: '/assets/uploads/users/default-avatar.png',
      };

      bcrypt.genSalt(10, (err, salt) => {
      // Check if there is error generating salt
        if (err) {
          return res.status(400).json({ message: 'Error Creating User, Try again ' });
        }

        bcrypt.hash(data.password, salt, (error, hash) => {
          if (error) throw error;
          data.password = hash;
          const text = `INSERT INTO
        users(id, name, email, password, type, status, userImage, created_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        returning *`;
          const values = [
            uuidv4(),
            data.name,
            data.email,
            data.password,
            data.type,
            data.status,
            data.userImage,
            new Date(),
          ];

          db.query(text, values).then((dbres) => {
            return res.status(201).json({ message: 'User Created Successfully', data: dbres.rows[0] });
          }).catch(() => {
            return res.status(400).json({ message: 'Error creating user, Please try again' });
          });
        });
      });
    }).catch(() => {
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
    const { errors, isValid } = usersValidation.validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { email, password } = req.body;

    const userexist = 'SELECT * FROM users WHERE email = $1';
    const userexistqueryvalue = [
      email,
    ];
    db.query(userexist, userexistqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ email: 'User Not Found' });
      }

      const userData = dbresponse.rows[0];
      bcrypt.compare(password, userData.password)
        .then((isMatch) => {
          if (isMatch) {
            // User Matched
            const payload = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              type: userData.type,
            };
            // Sign Token
            jwt.sign(payload, SECRET_OR_KEY, { expiresIn: 3600 }, (err, token) => {
              res.json({ success: true, token: `Bearer ${token}` });
            });
          } else {
            return res.status(401).json({ password: 'Incorrect Password' });
          }
        });
    }).catch(() => {
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
      email: req.user.email,
    });
  }
}

export default usersController;
