'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
/* eslint-disable import/first */


const { SECRET_OR_KEY } = process.env;

class Authenticate {
  static isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = _jsonwebtoken2.default.verify(token, SECRET_OR_KEY);
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  // Checks if user making the request is the store owner / admin
  static isAdmin(req, res, next) {
    if (req.user.type !== 1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }

  // Checks if user making the request is the store attendant admin
  // static isStoreAttendantAdmin(req, res, next) {
  //   if (req.user.type !== 2) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  //   next();
  // }


  // Checks if user making the request is the store attendant
  static isStoreAttendant(req, res, next) {
    if (req.user.type !== 3) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}

exports.default = Authenticate;