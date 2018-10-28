import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on('connect', () => {
  console.log('connected to the database');
});

/**
 * Create Tables
 */
const createTable = (queryText) => {
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      // return pool.end();
    })
    .catch((err) => {
        console.log(err);
        return pool.end();
    });
};

const usersQueryText = `CREATE TABLE IF NOT EXISTS
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
createTable(usersQueryText);


const productsQueryText = `CREATE TABLE IF NOT EXISTS
          products(
            id UUID PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            description TEXT NOT NULL,
            quantity VARCHAR(128) NOT NULL,
            price INT NOT NULL,
            product_image VARCHAR(128) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
          )`;
createTable(productsQueryText);

const salesQueryText = `CREATE TABLE IF NOT EXISTS
          sales(
            id UUID PRIMARY KEY,
            store_attendant_user_id VARCHAR(128) NOT NULL,
            orders json NOT NULL,
            total_sale_amount INT NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
          )`;
createTable(salesQueryText);
