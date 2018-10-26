import uuidv4 from 'uuid/v4';

// import db from '../models/mockdb';
import db from '../models/db';
import productsValidation from '../validation/products';

class productController {
  // @route   POST api/v1/products
  // @desc    This function implements the logic for creating new product.
  // @access  Private
  static createProduct(req, res) {
    const { errors, isValid } = productsValidation.validateProductInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let productImage = 'uploads\\products\\default.png';
    if (req.file) {
      productImage = req.file.path;
    }
    const {
      name, description, quantity, price,
    } = req.body;
    const host = req.get('host');

    const text = `INSERT INTO
    products(id, name, description, quantity, price, product_image, created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    returning *`;
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

      return res.status(201).json({ message: 'Product added successfully', data: response });
    }).catch(() => {
      return res.status(500).json({ message: 'Error creating user, Please try again' });
    });
  }


  // @route   GET api/v1/products
  // @desc    This function implements the logic for getting all products.
  // @access  Private
  static getProducts(req, res) {
    // res.json(db.products);


    const productsexist = 'SELECT * FROM products ';
    db.query(productsexist).then((dbresponse) => {
      console.log(dbresponse.rows)
      if (!dbresponse.rows[0]) {
        return res.status(404).json({ message: 'No Product Found' });
      }
      return res.status(200).json(dbresponse.rows);

    }).catch(() => {
      return res.status(500).json({ message: 'Error Fetching Products, Please try again' });
    });
  }

  // @route   GET api/v1/products/<productId>
  // @desc    This function implements the logic for getting a product detail by Id.
  // @access  Private
  static getProductById(req, res) {
    const { id } = req.params;

    const product = db.products[id - 1];
    if (!product) {
      return res.status(400).json({ message: `Product with id ${id} not found.` });
    }

    return res.json(product);
  }

  // @route   DELETE api/v1/products/<productId>
  // @desc    This function implements the logic for deleting a product by Id.
  // @access  Private
  static deleteProductById(req, res) {
    // Checks if user making the request is the store owner / admin
    if (!(Number(req.user.type) === 1)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const dbidtoberemoved = id - 1;

    const product = db.products[dbidtoberemoved];

    if (!product) {
      return res.status(400).json({ message: `Product with id ${id} not found.` });
    }

    if (product.id !== Number(id)) {
      return res.status(400).json({ message: `Product with id ${id} not found.` });
    }

    if (db.products.splice(dbidtoberemoved, 1)) {
      return res.json({ message: `Product with id ${id} deleted successfully.` });
    }

    return res.json({ message: 'Unable to delete product.' });
  }
}

export default productController;
