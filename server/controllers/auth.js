import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';

/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import db from '../models/db';
import queries from '../models/queries';

// Load Input validation
import usersValidation from '../validation/users';

const { SECRET_OR_KEY } = process.env;
class usersController {
  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/auth/register
   * @description This function implements the logic for registering a new user.
   * @access Private
   */
  static signup(req, res) {
    const { errors, isValid } = usersValidation.validateSignupInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json({ status: 'error', data: errors });
    }

    let userImage = process.env.USER_DEFAULT_IMAGE;
    if (req.file) {
      userImage = req.file.path;
    }

    const {
      email, password, name, type,
    } = req.body;
    const userexist = queries.userExist;
    const userexistqueryvalue = [
      email,
    ];
    db.query(userexist, userexistqueryvalue).then((dbresponse) => {
      if (dbresponse.rows[0]) {
        const emailExistResponse = {
          email: 'Email Already Exist',
        };
        return res.status(409).json({ status: 'error', data: emailExistResponse });
      }

      const data = {
        email,
        password,
        name,
        status: 1,
        type,
        userImage,
      };

      bcrypt.genSalt(10, (err, salt) => {
      // Check if there is error generating salt
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Error Creating User, Try again' });
        }

        bcrypt.hash(data.password, salt, (error, hash) => {
          if (error) throw error;
          data.password = hash;
          const text = queries.userInsert;
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
            const response = {
              id: dbres.rows[0].id,
              name: dbres.rows[0].name,
              email: dbres.rows[0].email,
              type: dbres.rows[0].type,
              status: dbres.rows[0].status,
            };
            return res.status(201).json({ status: 'success', message: 'User Created Successfully', data: response });
          }).catch(() => {
            return res.status(400).json({ status: 'error', message: 'Error creating user, Please try again' });
          });
        });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error creating user, Please try again' });
    });
  }

  /**
   * Login Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/auth/login
   * @description This function implements the logic to loggin a user.
   * @access Public
   */
  static login(req, res) {
    const { errors, isValid } = usersValidation.validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json({ status: 'error', data: errors });
    }
    const { email, password } = req.body;

    const userexist = queries.userExist;
    const userexistqueryvalue = [
      email,
    ];
    db.query(userexist, userexistqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        const response = {
          email: 'User Not Found',
        };
        return res.status(404).json({ status: 'error', data: response });
      }

      const userData = dbresponse.rows[0];
      bcrypt.compare(password, userData.password)
        .then((isMatch) => {
          if (isMatch) {
            // User Matched
            const payload = {
              id: userData.id,
              // email: userData.email,
              // name: userData.name,
              userImage: userData.userimage,
              type: userData.type,
            };
            // Sign Token
            jwt.sign(payload, SECRET_OR_KEY, { expiresIn: 3600 }, (err, token) => {
              const data = {
                token: `Bearer ${token}`,
                type: userData.type,
              };
              res.json({ status: 'success', data });
            });
          } else {
            const incorrectPasswordResponse = {
              password: 'Incorrect Password',
            };
            return res.status(401).json({ status: 'error', data: incorrectPasswordResponse });
          }
        });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Logging in user, Please try again' });
    });
  }

  /**
   * GetCurrentUser Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/auth/current
   * @description This function implements the logic for getting the current user
   * details with token parsed.
   * @access Private
   */
  static getCurrentUser(req, res) {
    const { id } = req.user;

    const text = queries.userExistWithId;
    const userqueryvalue = [
      id,
    ];
    db.query(text, userqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: 'User not found.' });
      }
      const response = {
        name: dbresponse.rows[0].name,
        email: dbresponse.rows[0].email,
        userImage: dbresponse.rows[0].userimage,
        type: dbresponse.rows[0].type,
        status: dbresponse.rows[0].status,
      };
      return res.json({ status: 'success', data: response });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching User Details, Please try again' });
    });
  }

  /**
   * MakeaAdmin Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/auth/makeadmin
   * @description This function implements the logic for making a
   * store attendant an admin.
   * @access Private
   */
  static makeAdmin(req, res) {
    const { errors, isValid } = usersValidation.validateMakeAdminInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json({ status: 'error', data: errors });
    }

    const { email } = req.body;

    const userexist = queries.userExist;
    const userexistqueryvalue = [
      email,
    ];
    db.query(userexist, userexistqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: 'User Not Found' });
      }
      const user = dbresponse.rows[0];
      if (user.type === 1) {
        return res.status(400).json({ status: 'error', message: 'User already an admin' });
      }

      const updatetext = queries.userUpdate;
      const updatevalue = [
        user.id,
        1,
      ];
      db.query(updatetext, updatevalue).then((updatedbresponse) => {
        const data = updatedbresponse.rows[0];
        const response = {
          name: data.name,
          email: data.email,
          userimage: data.userimage,
          type: data.type,
        };
        return res.json({ status: 'success', message: 'Attendant switched to Admin successfully', data: response });
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Making Store Attendant an Admin, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Making Store Attendant an Admin, Please try again' });
    });
  }

  /**
   * Get Attendants Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/auth/attendants
   * @description This function implements the logic for getting all store attendants.
   * @access Private
   */
  static getAttendants(req, res) {
    const userQuery = queries.userAttendants;
    db.query(userQuery).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: 'No Attendant Found' });
      }
      return res.status(200).json({ status: 'success', data: dbresponse.rows });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Attendants, Please try again' });
    });
  }

  /**
   * Delete Attendant Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route DELETE api/v1/auth/attendant/attendantId
   * @description This function implements the logic for deleting a store attendant.
   * @access Private
   */
  static deleteAttendant(req, res) {
    const { id } = req.params;
    const text = queries.userExistWithId;
    const userqueryvalue = [
      id,
    ];
    db.query(text, userqueryvalue).then((dbresponse) => {

      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `User with id ${id} not found.` });
      }
      const userdeletetext = queries.userDeleteWithId;
      const userdeletequeryvalue = [
        id,
      ];
      db.query(userdeletetext, userdeletequeryvalue).then((dbres) => {
        if (dbres.rows) {
          return res.status(200).json({ status: 'success', message: `User with id ${id} deleted successfully.` });
        }
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Deleting User, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Deleting User, Please try again' });
    });
  }

  /**
   * Auth Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/auth/<id>
   * @description This function implements the logic for getting a user detail by Id.
   * @access Private
   */
  static getUserById(req, res) {
    const { id } = req.params;

    const text = queries.userExistWithId;
    const userqueryvalue = [
      id,
    ];
    db.query(text, userqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `User with id ${id} not found.` });
      }
      const response = {
        id: dbresponse.rows[0].id,
        name: dbresponse.rows[0].name,
        email: dbresponse.rows[0].email,
        userimage: dbresponse.rows[0].userimage,
        type: dbresponse.rows[0].type,
        status: dbresponse.rows[0].status,

      };
      return res.json({ status: 'success', data: response });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching User Details, Please try again' });
    });
  }
}


export default usersController;
