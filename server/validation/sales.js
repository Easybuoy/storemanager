// import Validator from 'validator';
import isEmpty from './isEmpty';

const validateSalesInput = (input) => {
  const errors = {};
  const data = input;
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.product_id = !isEmpty(data.product_id) ? data.product_id : '';

  // if (Validator.isEmpty(data.quantity)) {
  //   errors.quantity = 'Quantity field is required';
  // }

  // if (Validator.isEmpty(data.product_id)) {
  //   errors.product_id = 'Product Id field is required';
  // }

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
