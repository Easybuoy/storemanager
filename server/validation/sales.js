import isEmpty from './isEmpty';

const validateSalesInput = (input) => {
  const errors = {};
  const data = input;
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.product_id = !isEmpty(data.product_id) ? data.product_id : '';
  let isInvalidObject = false;
  let isQuantityNotInt = false;


  if (data.order) {
    if (typeof Array.isArray(data.order)) {
      data.order.map((singleOrder) => {
        if (Object.keys(singleOrder).length === 0) {
          isInvalidObject = true;
          return false;
        }

        if (typeof singleOrder.quantity !== 'number') {
          isQuantityNotInt = true;
          return false;
        }
      });

      if (isInvalidObject) {
        errors.order = 'Invalid array of objects provided for order.';
      }

      if (isQuantityNotInt) {
        errors.order = 'One or more of quantity provided for order is not a number';
      }
    }
  }

  if (!Array.isArray(data.order)) {
    errors.order = 'Order must be an array of object(s)';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateSalesInput,
};
