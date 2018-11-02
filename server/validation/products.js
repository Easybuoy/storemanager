import Validator from 'validator';
import isEmpty from './isEmpty';

const validateProductInput = (input) => {
  const errors = {};
  const data = input;
  data.name = !isEmpty(data.name) ? data.name : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.price = !isEmpty(data.price) ? data.price : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  if (!Validator.isInt(data.price)) {
    errors.price = 'Price field must be a number';
  }

  if (!data.price) {
    errors.price = 'Price field is required';
  }

  if (!Validator.isInt(data.quantity)) {
    errors.quantity = 'Quantty field must be a number';
  }

  if (!data.quantity) {
    errors.quantity = 'Quantity field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateProductInput,
};
