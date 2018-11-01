import Validator from 'validator';
import isEmpty from './isEmpty';

const validateCategoryInput = (input) => {
  const errors = {};
  const data = input;
  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateCategoryInput,
};
