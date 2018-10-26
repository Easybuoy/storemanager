// import { Pool } from 'pg';
/* eslint-disable import/first */
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
/* eslint-disable-next-line */
const Pool = require('pg').Pool;
// const uuidv4 = require('uuid/v4');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on('connect', () => {
  console.log('connected to the database');
});


/**
 * Create User Tables
 */
const createTable = (queryText) => {
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      return pool.end();
    })
    .catch((err) => {
      console.log(err);
      return pool.end();
    });
};

  /**
     * Drop Products Table
   */
const dropTable = (queryText) => {
  // const queryText = 'DROP TABLE IF EXISTS products';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      return pool.end();
    })
    .catch((err) => {
      console.log(err);
      return pool.end();
    });
};
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        users(
          id UUID PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          email VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL,
          userImage VARCHAR(128) NOT NULL,
          type INT NOT NULL,
          status INT NOT NULL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP
        )`;

  createTable(queryText);
};

  /**
   * Drop User Table
   */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  return dropTable(queryText);
};


/**
 * Create Products Tables
 */
const createProductsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
          products(
            id UUID PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            description VARCHAR(128) NOT NULL,
            quantity VARCHAR(128) NOT NULL,
            price INT NOT NULL,
            product_image VARCHAR(128) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
          )`;

  return createTable(queryText);
};

/**
     * Drop Products Table
   */
const dropProductsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS products';
  dropTable(queryText);
};

/**
 * Create Sales Tables
 */
const createSalesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
          sales(
            id UUID PRIMARY KEY,
            store_attendant_user_id INT NOT NULL,
            orders VARCHAR(128) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
          )`;
  return createTable(queryText);
};
  /**
       * Drop Sales Table
     */
const dropSalesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS sales';
  return dropTable(queryText);
};

module.exports = {
  createUsersTable,
  dropUsersTable,
  createProductsTable,
  dropProductsTable,
  createSalesTable,
  dropSalesTable,
};

/* eslint-disable-next-line */
require('make-runnable');