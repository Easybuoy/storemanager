// import db from '../models/mockdb';
import db from '../../models/db';
import salesValidation from '../../validation/sales';

class saleControlerHelper {
  /**
   * Signup Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/sales
   * @description This function implements the logic for creating a new sale.
   * @access Private
   */
  static async processSale(req, res, next) {
    const { errors, isValid } = salesValidation.validateSalesInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let totalSalesAmount = 0;
    let totalSingleProductAmount = 0;
    let productToBeUpdated = [];
    const { order } = req.body;
    const orderLength = order.length;
    const promises = order.map(async (singleorder) => {
      const productId = singleorder.product_id;

      const text = 'SELECT * FROM products WHERE id = $1';
      const productqueryvalue = [
        productId,
      ];

      const response = await db.query(text, productqueryvalue);
      return response;
    });

    // wait until all promises resolve
    await Promise.all(promises).then((response) => {
      let i;
      for (i = 0; i < orderLength; i++) {
        const singleresponse = response[i];
        // Check if product exist in store.
        if (singleresponse.rowCount === 0) {
          return res.status(400).json({ message: 'One of product requested not found' });
        }
        // Check if quantity requested is greater than quantity in stock
        if (Number(order[i].quantity) > Number(singleresponse.rows[0].quantity)) {
          return res.status(400).json({ message: 'One of product requested is more than in stock' });
        }
        const totalamount = Number(order[i].quantity) * Number(singleresponse.rows[0].price);
        req.body.order[i].totalProductAmount = totalamount;
        req.body.order[i].latestquantitytobeupdatedindb = Number(singleresponse.rows[0].quantity) - Number(order[i].quantity);
        totalSalesAmount += totalamount;
      }
      req.totalSaleAmount = totalSalesAmount;
      next();
    }).catch(() => {
      return res.status(400).json({ message: 'Error Creating Sale, Please Try Again' });
    });
  }

  static updateProduct(req, res, next) {
    const { order } = req.body;
    const orderLength = order.length;
    let arrayOrderLength = 0;

    order.map((singleorder) => {
      // console.log(arrayOrderLength)
      arrayOrderLength += 1;
      const { quantity } = singleorder;
      const productId = singleorder.product_id;
    const text = 'UPDATE products SET quantity=($2), updated_at=($3) WHERE id=($1) returning *';
    const values = [
      productId,
      Number(singleorder.latestquantitytobeupdatedindb),
      new Date(),
    ];
    console.log(req.latestquantitytobeupdatedindb)
    db.query(text, values).then((dbres) => {
      // return res.status(200).json(dbres.rows);
    }).catch((e) => {
      console.log(e)
      // return res.status(500).json({ message: 'Error Updating Products, Please try again' });
    });
    delete singleorder.latestquantitytobeupdatedindb;
    console.log(arrayOrderLength)
    if(orderLength === arrayOrderLength) {
      console.log('entered')
      next();
    }
    });
  }
}

export default saleControlerHelper;
