// import db from '../models/mockdb';
import db from '../../models/db';
import salesValidation from '../../validation/sales';

class saleControlerHelper {
  /**
   * Sale Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/sales
   * @description This function processes the sale and validates user input and product.
   * @access Private
   */
  static async processSale(req, res, next) {
    const { errors, isValid } = salesValidation.validateSalesInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let totalSalesAmount = 0;
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
      for (i = 0; i < orderLength; i += 1) {
        const singleresponse = response[i];
        // Check if product exist in store.
        if (singleresponse.rowCount === 0) {
          return res.status(400).json({ message: 'One Of Product Requested Is Not Available' });
        }
        // Check if quantity requested is greater than quantity in stock
        if (Number(order[i].quantity) > Number(singleresponse.rows[0].quantity)) {
          return res.status(400).json({ message: 'One Of Product Requested Is More Than In Stock' });
        }
        const totalamount = Number(order[i].quantity) * Number(singleresponse.rows[0].price);
        req.body.order[i].totalProductAmount = totalamount;
        // eslint-disable-next-line
        req.body.order[i].latestquantitytobeupdatedindb = Number(singleresponse.rows[0].quantity) - Number(order[i].quantity);
        totalSalesAmount += totalamount;
      }
      req.totalSaleAmount = totalSalesAmount;
      next();
    }).catch(() => {
      return res.status(400).json({ message: 'Error Creating Sale, Please Try Again' });
    });
  }

  /**
   * Sale Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/sales
   * @description This function is called after process sale function and it updates the products
   * with new quantity value.
   * @access Private
   */
  static updateProduct(req, res, next) {
    const { order } = req.body;
    const orderLength = order.length;
    let arrayOrderLength = 0;

    order.map((singleord) => {
      const singleorder = singleord;
      arrayOrderLength += 1;
      // const { quantity } = singleorder;
      const productId = singleorder.product_id;
      const text = 'UPDATE products SET quantity=($2), updated_at=($3) WHERE id=($1) returning *';
      const values = [
        productId,
        Number(singleorder.latestquantitytobeupdatedindb),
        new Date(),
      ];
      db.query(text, values).then(() => {
      }).catch(() => {
      });
      delete singleorder.latestquantitytobeupdatedindb;
      if (orderLength === arrayOrderLength) {
        next();
      }
    });
  }
}

export default saleControlerHelper;
