import uuidv4 from 'uuid/v4';

// import db from '../models/mockdb';
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
    const text = `INSERT INTO
    sales(id, store_attendant_user_id, orders, total_sale_amount, created_at)
    VALUES($1, $2, $3, $4, $5)
    returning *`;
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

        const insertText = `INSERT INTO
        orders(id, sale_id, product_id, quantity, created_at)
        VALUES($1, $2, $3, $4, $5)
        returning *`;
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
          return res.status(201).json({ message: 'Sale added successfully', data: response });
        }
      });
    }).catch(() => {
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
    const salesExist = 'SELECT o.sale_id, o.quantity, o.created_at, p.name, p.description, p.price FROM orders as o JOIN products as p ON o.product_id = p.id;';
    db.query(salesExist).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ message: 'No Sale Found' });
      }
      return res.status(200).json(dbresponse.rows);
    }).catch(() => {
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
    const { id } = req.params;
    let queryText = '';
    let queryValue = '';

    if (req.user.type === 2) {
      queryText = `SELECT p.name, p.description, p.product_image, p.price, o.quantity, o.created_at FROM sales as s JOIN orders as o ON 
      s.id = o.sale_id JOIN products as p ON o.product_id = p.id WHERE s.store_attendant_user_id = $2 AND s.id = $1;`;
      queryValue = [id, req.user.id];
    } else { console.log('aaaa')
      queryText = `SELECT p.name, p.description, p.product_image, p.price, o.quantity, o.created_at FROM sales as s JOIN orders as o ON 
      s.id = o.sale_id JOIN products as p ON o.product_id = p.id WHERE s.id = $1;`;
      queryValue = [id];
    }


    db.query(queryText, queryValue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ message: `Sale with id ${id} not found. Or Unauthorized Access` });
      }

      const sale = dbresponse.rows;
      return res.json(sale);
    }).catch((e) => { console.log(e)
      return res.status(400).json({ message: 'Error Fetching Sale Details, Please try again' });
    });

}

}

export default salesControler;
