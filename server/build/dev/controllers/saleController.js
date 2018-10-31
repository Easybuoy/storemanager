'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class salesControler {
  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/sales
   * @description This function implements the logic for creating a new sale.
   * @access Private
   */
  static createSale(req, res) {
    const text = `INSERT INTO
    sales(id, store_attendant_user_id, orders, total_sale_amount, created_at)
    VALUES($1, $2, $3, $4, $5)
    returning *`;
    const values = [(0, _v2.default)(), req.user.id, JSON.stringify(req.body.order), req.totalSaleAmount, new Date()];

    _db2.default.query(text, values).then(dbres => {
      const response = dbres.rows[0];
      return res.status(201).json({ message: 'Sale added successfully', data: response });
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error creating user, Please try again' });
    });
  }

  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/sales
   * @description This function implements the logic for getting all sale records.
   * @access Private
   */
  static getSales(req, res) {
    // res.json(db.sales);
    const salesexist = 'SELECT * FROM sales ';
    _db2.default.query(salesexist).then(dbresponse => {
      if (!dbresponse.rows[0]) {
        return res.status(404).json({ message: 'No Sale Found' });
      }
      return res.status(200).json(dbresponse.rows);
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Fetching Sales, Please try again' });
    });
  }

  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/sales/<saleId>
   * @description This function implements the logic for getting a sale details by Id.
   * @access Private
   */
  static getSaleById(req, res) {
    // check if user making the request is the Store Owner / Admin

    if (!Number(req.user.type) === 1 || !Number(req.user.type) === 3) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const text = 'SELECT * FROM sales WHERE id = $1';
    const salequeryvalue = [id];
    _db2.default.query(text, salequeryvalue).then(dbresponse => {
      const sale = dbresponse.rows[0];
      if (!sale) {
        return res.status(400).json({ message: `Sale with id ${id} not found.` });
      }

      if (Number(req.user.type) !== 1) {
        // check if user making the request is the store attendant that made the sale
        if (req.user.id !== sale.store_attendant_user_id) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      }
      return res.json(sale);
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Fetching Sale Details, Please try again' });
    });
  }
}

// import db from '../models/mockdb';
exports.default = salesControler;