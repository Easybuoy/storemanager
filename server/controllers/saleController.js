import db from '../models/db';
import salesValidation from '../validation/sales';

class salesControler {
  // @route   POST api/v1/sales
  // @desc    This function implements the logic for creating a new sale.
  // @access  Private
  static createSale(req, res) {
    const processSale = (order) => {
      let isMoreThanStock = false;
      let isNotProductAvailable = false;
      let totalSalesAmount = 0;
      order.map((ordertobeprocessed) => {
        const { quantity } = ordertobeprocessed;
        const productId = ordertobeprocessed.product_id;

        const product = db.products[productId - 1];

        if (!product) {
          isNotProductAvailable = true;
          return false;
        }

        const productPrice = Number(product.price.amount);
        const productQuantity = Number(product.quantity);
        // Check if quantity in stock for product is more than quantity requested
        if (quantity > product.quantity) {
          isMoreThanStock = true;
          return false;
        }

        const totalamount = quantity * productPrice;

        // Update 'product table' by reducing quantity left in store from what user just bought
        product.quantity = productQuantity - quantity;
        totalSalesAmount += totalamount;
        return { status: 200, totalamount };
      });

      if (isNotProductAvailable) {
        return { status: 400, message: 'One Of Product Requested Is Not Available' };
      }

      if (isMoreThanStock) {
        return { status: 400, message: 'One Of Product Requested Is More Than In Stock' };
      }

      const response = { amount: totalSalesAmount, currency: '$' };
      return response;
    };

      // check if user making the request is the Store Owner / Admin
    if (Number(req.user.type) !== 3) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { errors, isValid } = salesValidation.validateSalesInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const processedSale = processSale(req.body.order);
    // Check if there is error processing sale
    if (processedSale.status === 400) {
      return res.status(400).json({ message: processedSale.message });
    }

    let id = db.sales.length;
    id += 1;

    const data = {
      id,
      store_attendant_user_id: req.user.id,
      order: req.body.order,
      totalSaleAmount: processedSale,
      date_time: new Date(),
    };
    db.sales.push(data);

    return res.status(201).json({ message: 'Sale added successfully', data });
  }

  // @route   GET api/v1/sales
  // @desc    This function implements the logic for getting all sale records.
  // @access  Private
  static getSales(req, res) {
    // check if user making the request Store Owner / Admin
    if (Number(req.user.type) !== 1) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(db.sales);
  }

  // @route   GET api/v1/sales/<saleId>
  // @desc    This function implements the logic for getting a sale details by Id.
  // @access  Private
  static getSaleById(req, res) {
    // check if user making the request is the Store Owner / Admin

    if (!Number(req.user.type) === 1 || !Number(req.user.type) === 3) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const sales = db.sales[id - 1];

    if (sales) {
      if (Number(req.user.type) !== 1) {
      // check if user making the request is the store attendant that made the sale
        if (req.user.id !== sales.store_attendant_user_id) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      }
    }

    if (!sales) {
      return res.status(400).json({ message: `Sales with id ${id} not found.` });
    }

    return res.json(sales);
  }
}

export default salesControler;