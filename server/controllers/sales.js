import uuidv4 from 'uuid/v4';

import queries from '../models/queries';
import db from '../models/db';

class salesControler {
  /**
   * Sale Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/sales
   * @description This function implements the logic for creating a new sale.
   * @access Private
   */
  static createSale(req, res) {
    const { order } = req.body;
    const text = queries.saleInsert;
    const values = [
      uuidv4(),
      req.user.id,
      JSON.stringify(order),
      req.totalSaleAmount,
      new Date(),
    ];

    db.query(text, values).then((dbres) => {
      const response = dbres.rows[0];
      let arrayOrderLength = 0;

      order.map((singleOrder) => {
        arrayOrderLength += 1;

        const insertText = queries.ordersInsert;
        const insertValues = [
          uuidv4(),
          response.id,
          singleOrder.product_id,
          Number(singleOrder.quantity),
          new Date(),
        ];
        db.query(insertText, insertValues).then(() => {
        }).catch(() => {
        });

        if (order.length === arrayOrderLength) {
          return res.status(201).json({ status: 'success', message: 'Sale added successfully', data: response });
        }
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error creating user, Please try again' });
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
    const salesExist = queries.salesExistForGetSales;
    db.query(salesExist).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: 'No Sale Found' });
      }
      return res.status(200).json({ status: 'success', data: dbresponse.rows });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Sales, Please try again' });
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
    const { id } = req.params;
    let queryText = '';
    let queryValue = '';

    if (req.user.type === 2) {
      queryText = queries.salesByIdAttendant;
      queryValue = [id, req.user.id];
    } else {
      queryText = queries.salesByIdAdmin;
      queryValue = [id];
    }


    db.query(queryText, queryValue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Sale with id ${id} not found. Or Unauthorized Access` });
      }

      const sale = dbresponse.rows;
      return res.json({ status: 'success', data: sale });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Sale Details, Please try again' });
    });
  }
}

export default salesControler;
