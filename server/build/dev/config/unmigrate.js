'use strict';

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Pool } = _pg2.default;
_dotenv2.default.config();

const pool = new Pool({
  connectionString: process.env.DB_URL
});

pool.on('connect', () => {
  console.log('connected to the database');
});

/**
     * Drop Tables
   */
const dropTable = queryText => {
  pool.query(queryText).then(res => {
    console.log(res);
    //   return pool.end();
  }).catch(err => {
    console.log(err);
    //   return pool.end();
  });
};
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const usersQueryText = 'DROP TABLE IF EXISTS users';
dropTable(usersQueryText);

const productsQueryText = 'DROP TABLE IF EXISTS products';
dropTable(productsQueryText);

const salesQueryText = 'DROP TABLE IF EXISTS sales';
dropTable(salesQueryText);