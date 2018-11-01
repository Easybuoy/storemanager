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
    console.log(req.body.order)
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
        orders(id, sale_id, product_id, created_at)
        VALUES($1, $2, $3, $4)
        returning *`;
        const insertValues = [
          uuidv4(),
          response.id,
          singleOrder.product_id,
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
    // res.json(db.sales);
    // const salesExist = 'SELECT * FROM sales ';
    const salesExist = 'SELECT * FROM orders as o JOIN sales as s ON o.sale_id = s.id';
    db.query(salesExist).then((dbresponse) => { console.log(dbresponse)
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ message: 'No Sale Found' });
      }
      return res.status(200).json(dbresponse.rows);
    }).catch((e) => { console.log(e)
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
    const salequeryvalue = [
      id,
    ];
    db.query(text, salequeryvalue).then((dbresponse) => {
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
      return res.status(400).json({ message: 'Error Fetching Sale Details, Please try again' });
    });
  }
}

export default salesControler;
