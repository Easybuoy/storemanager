import uuidv4 from 'uuid/v4';
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import queries from '../models/queries';
import db from '../models/db';
import categoriesValidation from '../validation/categories';

class categoryController {
  /**
   * Categories Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route POST api/v1/categories
   * @description This function implements the logic for creating new category.
   * @access Private
   */
  static createCategory(req, res) {
    const { errors, isValid } = categoriesValidation.validateCategoryInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json({ status: 'error', data: errors });
    }

    let { name } = req.body;
    name = name.trim();
    const host = req.get('host');

    const text = `INSERT INTO
    categories(id, name, created_at)
    VALUES($1, $2, $3)
    returning *`;
    const values = [
      uuidv4(),
      name,
      new Date(),
    ];

    const categoryExist = queries.categoryExistWithName;

    const categoryExistValue = [name];
    db.query(categoryExist, categoryExistValue).then((dbresponse) => {
      if (dbresponse.rowCount > 0) {
        return res.status(409).json({ status: 'error', message: `Category with name ${name} already exists` });
      }
      db.query(text, values).then((dbres) => {
        const response = dbres.rows[0];
        response.request = {
          method: 'GET',
          url: `${host}/api/v1/categories/${dbres.rows[0].id}`,
        };
        return res.status(201).json({ status: 'success', message: 'Category added successfully', data: response });
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error creating category, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error creating category, Please try again' });
    });
  }


  /**
   * Get Categories Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/categories
   * @description This function implements the logic for getting all categories.
   * @access Private
   */
  static getCategories(req, res) {
    const text = queries.categoryExists;
    db.query(text).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(404).json({ status: 'error', message: 'No Category Found' });
      }
      return res.status(200).json({ status: 'success', data: dbresponse.rows });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Category, Please try again' });
    });
  }

  /**
   * Category Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route GET api/v1/categories/<categoryId>
   * @description This function implements the logic for getting a categry detail by Id.
   * @access Private
   */
  static getCategoryById(req, res) {
    const { id } = req.params;

    const text = queries.categoryExistWithId;
    const categoryqueryvalue = [
      id,
    ];
    db.query(text, categoryqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Category with id ${id} not found.` });
      }
      return res.json({ status: 'success', data: dbresponse.rows[0] });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Fetching Category Details, Please try again' });
    });
  }

  /**
   * Delete A Category Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route DELETE api/v1/categories/<categoryId>
   * @description This function implements the logic for deleting a category by Id.
   * @access Private
   */
  static deleteCategory(req, res) {
    const { id } = req.params;
    const text = queries.categoryExistWithId;
    const categoryqueryvalue = [
      id,
    ];
    db.query(text, categoryqueryvalue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Category with id ${id} not found.` });
      }
      const categorydeletetext = queries.categoryDeleteWithId;
      const categorydeletequeryvalue = [
        id,
      ];
      db.query(categorydeletetext, categorydeletequeryvalue).then((dbres) => {
        if (dbres.rows) {
          return res.status(200).json({ status: 'success', message: `Category with id ${id} deleted successfully.` });
        }
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Deleting Category, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Deleting Category, Please try again' });
    });
  }

  /**
   * Category Route
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   * @route PUT api/v1/category/<categoryId>
   * @description This function implements the logic for updating a category detail by Id.
   * @access Private
   */
  static updateCategory(req, res) {
    const { id } = req.params;

    const { name } = req.body;


    const categoryExist = queries.categoryExistWithId;
    const categoryExistValue = [id];
    db.query(categoryExist, categoryExistValue).then((dbresponse) => {
      if (dbresponse.rowCount === 0) {
        return res.status(400).json({ status: 'error', message: `Category with id ${id} not found.` });
      }


      const text = queries.categoryUpdateWithId;
      const values = [
        id,
        name,
        new Date(),
      ];
      db.query(text, values).then((dbres) => {
        return res.status(200).json({ status: 'success', message: 'Category Updated Successfully', data: dbres.rows[0] });
      }).catch(() => {
        return res.status(400).json({ status: 'error', message: 'Error Updating Category, Please try again' });
      });
    }).catch(() => {
      return res.status(400).json({ status: 'error', message: 'Error Updating Category, Please try again' });
    });
  }
}


export default categoryController;
