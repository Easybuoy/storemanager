import { Pool } from 'pg';
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export default {
  /**
     * DB Query
     * @param {object} req
     * @param {object} res
     * @returns {object} object
     */
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
