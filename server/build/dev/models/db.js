'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
/* eslint-disable import/first */


const pool = new _pg.Pool({
  connectionString: process.env.DB_URL
});

exports.default = {
  /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
};