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

    let id = db.products.length;
    id += 1;
    const host = req.get('host');
    const data = {
      id,
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: {
        currency: '$',
        amount: req.body.price,
      },
      productImage,
    };

    db.products.push(data);

    data.request = {
      method: 'GET',
      url: `${host}/api/v1/products/${id}`,
    };

    return res.status(201).json({ message: 'Product added successfully', data });
  }


  // @route   GET api/v1/products
  // @desc    This function implements the logic for getting all products.
  // @access  Private
  static getProducts(req, res) {
    res.json(db.products);
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
