'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

var _products = require('../validation/products');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import db from '../models/mockdb';
class productController {
  /**
   * Product Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/products
   * @description This function implements the logic for creating new product.
   * @access Private
   */
  static createProduct(req, res) {
    const { errors, isValid } = _products2.default.validateProductInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let productImage = 'uploads\\products\\default.png';
    if (req.file) {
      /* istanbul ignore next */
      productImage = req.file.path;
    }
    const {
      name, description, quantity, price
    } = req.body;
    const host = req.get('host');

    const text = `INSERT INTO
    products(id, name, description, quantity, price, product_image, created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    returning *`;
    const values = [(0, _v2.default)(), name, description, quantity, price, productImage, new Date()];

    _db2.default.query(text, values).then(dbres => {
      const response = dbres.rows[0];
      response.request = {
        method: 'GET',
        url: `${host}/api/v1/products/${dbres.rows[0].id}`
      };

      return res.status(201).json({ message: 'Product added successfully', data: response });
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error creating user, Please try again' });
    });
  }

  /**
   * Product Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/products
   * @description This function implements the logic for getting all products.
   * @access Private
   */
  static getProducts(req, res) {
    const productsexist = 'SELECT * FROM products ';
    _db2.default.query(productsexist).then(dbresponse => {
      if (!dbresponse.rows[0]) {
        return res.status(404).json({ message: 'No Product Found' });
      }
      return res.status(200).json(dbresponse.rows);
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Fetching Products, Please try again' });
    });
  }

  /**
   * Product Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/products/<productId>
   * @description This function implements the logic for getting a product detail by Id.
   * @access Private
   */
  static getProductById(req, res) {
    const { id } = req.params;

    const text = 'SELECT * FROM products WHERE id = $1';
    const productqueryvalue = [id];
    _db2.default.query(text, productqueryvalue).then(dbresponse => {
      if (!dbresponse.rows[0]) {
        return res.status(400).json({ message: `Product with id ${id} not found.` });
      }
      return res.json(dbresponse.rows[0]);
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Fetching Products Details, Please try again' });
    });
  }

  /**
   * Product Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route DELETE api/v1/products/<productId>
   * @description This function implements the logic for deleting a product by Id.
   * @access Private
   */
  static deleteProductById(req, res) {
    const { id } = req.params;
    const text = 'SELECT * FROM products WHERE id = $1';
    const productqueryvalue = [id];
    _db2.default.query(text, productqueryvalue).then(dbresponse => {
      if (!dbresponse.rows[0]) {
        return res.status(400).json({ message: `Product with id ${id} not found.` });
      }
      const productdeletetext = 'DELETE FROM products WHERE id = $1 returning *';
      const productdeletequeryvalue = [id];
      _db2.default.query(productdeletetext, productdeletequeryvalue).then(dbres => {
        if (dbres.rows) {
          return res.status(200).json({ message: `Product with id ${id} deleted successfully.` });
        }
      }).catch(() => {
        /* istanbul ignore next */
        return res.status(400).json({ message: 'Error Deleting Products, Please try again' });
      });
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Deleting Products, Please try again' });
    });
  }

  /**
   * Product Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route PUT api/v1/products/<productId>
   * @description This function implements the logic for updating a product detail by Id.
   * @access Private
   */
  static updateProductById(req, res) {
    const { id } = req.params;

    let productImage = 'uploads\\products\\default.png';
    if (req.file) {
      /* istanbul ignore next */
      productImage = req.file.path;
    }
    const {
      name, description, quantity, price
    } = req.body;

    const text = 'UPDATE products SET name=($2), description=($3), quantity=($4), price=($5), product_image=($6), updated_at=($7) WHERE id=($1) returning *';
    const values = [id, name, description, quantity, price, productImage, new Date()];

    _db2.default.query(text, values).then(dbres => {
      return res.status(200).json(dbres.rows[0]);
    }).catch(() => {
      /* istanbul ignore next */
      return res.status(400).json({ message: 'Error Updating Products, Please try again' });
    });
  }
}

exports.default = productController;