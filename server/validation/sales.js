const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSalesInput = (input) => {
  const errors = {};
  const data = input;
  data.store_attendant_user_id = !isEmpty(data.store_attendant_user_id) ? data.store_attendant_user_id : '';
  data.product_id = !isEmpty(data.product_id) ? data.product_id : '';

  if (Validator.isEmpty(data.store_attendant_user_id)) {
    errors.store_attendant_user_id = 'Store Attendant User Id is required';
  }

  if (Validator.isEmpty(data.product_id)) {
    errors.product_id = 'Product Id field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateSalesInput,
};
