import uuidv4 from 'uuid/v4';
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import db from '../models/db';
import queries from '../models/queries';
import productsValidation from '../validation/products';

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
    const { errors, isValid } = productsValidation.validateProductInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json({ status: 'error', data: errors });
    }

    let productImage = process.env.PRODUCT_DEFAULT_IMAGE;
    if (req.file) {
      productImage = req.file.path;
    }
    const {
      name, description, quantity, price,
    } = req.body;
    const host = req.get('host');

    const text = queries.productInsert;
    const values = [
      uuidv4(),
      name,
      description,
      quantity,
      price,
      productImage,
      new Date(),
    ];

    db.query(text, values).then((dbres) => {
      const response = dbres.rows[0];
      response.request = {
        method: 'GET',
        url: `${host}/api/v1/products/${dbres.rows[0].id}`,
      };

      return res.status(201).json({ status: 'success', message: 'Product added successfully', data: response });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error creating user, Please try again' });
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
    const productsExist = queries.productExist;
    db.query(productsExist).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        const response = { message: 'No Product Found' };
        return res.status(404).json({ status: 'error', data: response });
      }
      return res.status(200).json({ status: 'success', data: dbresponse.rows });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Products, Please try again' });
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

    const text = queries.productExistWithId;
    const productqueryvalue = [
      id,
    ];
    db.query(text, productqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Product with id ${id} not found.` });
      }
      return res.json({ status: 'success', data: dbresponse.rows[0] });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Products Details, Please try again' });
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
    const text = queries.productExistWithId;
    const productqueryvalue = [
      id,
    ];
    db.query(text, productqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Product with id ${id} not found.` });
      }
      const productdeletetext = queries.productDeleteWithId;
      const productdeletequeryvalue = [
        id,
      ];
      db.query(productdeletetext, productdeletequeryvalue).then((dbres) => {
        if (dbres.rows) {
          return res.status(200).json({ status: 'success', message: `Product with id ${id} deleted successfully.` });
        }
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Deleting Products, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Deleting Products, Please try again' });
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

    let productImage = process.env.PRODUCT_DEFAULT_IMAGE;
    if (req.file) {
      productImage = req.file.path;
    }
    const {
      name, description, quantity, price,
    } = req.body;

    const text = queries.productUpdateWithId;
    const values = [
      id,
      name,
      description,
      quantity,
      price,
      productImage,
      new Date(),
    ];

    db.query(text, values).then((dbres) => {
      return res.status(200).json({ status: 'success', data: dbres.rows[0] });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Updating Products, Please try again' });
    });
  }

  /**
   * AssignProduct To Category Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route PUT api/v1/products/<productId>/<categoryId>
   * @description This function implements the logic for assigning a product to category.
   * @access Private
   */
  static assignProductToCategory(req, res) {
    const { id, categoryId } = req.params;

    const productExist = queries.productExistWithId;
    const productExistQueryValue = [
      id,
    ];
    db.query(productExist, productExistQueryValue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Product with id ${id} not found.` });
      }
      const categoryExist = queries.categoryExistWithId;
      const categoryExistQueryValue = [
        categoryId,
      ];
      db.query(categoryExist, categoryExistQueryValue).then((dbcategoryresponse) => {
        if (dbcategoryresponse.rowCount === 0) {
          return res.status(400).json({ status: 'error', message: `Category with id ${categoryId} not found.` });
        }
        const productUpdateText = queries.productUpdateCategoryWithId;
        const productUpdateValues = [
          id,
          categoryId,
          new Date(),
        ];
        db.query(productUpdateText, productUpdateValues).then(() => {
          return res.status(200).json({ status: 'success', message: 'Product assigned to category successfully' });
        }).catch(() => {
          return res.status(400).json({ status: 'error', message: 'Error Assigning Product To Category, Please try again' });
        });
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Assigning Product To Category, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Assigning Product To Category, Please try again' });
    });
  }
}


export default productController;
