import Validator from 'validator';
import isEmpty from './isEmpty';

const validateSignupInput = (input) => {
  const errors = {};
  const data = input;

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.type = !isEmpty(data.type) ? data.type : '';

  if (!Validator.isAlpha(data.name)) {
    errors.name = 'Name cannot contain number(s)';
  }

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!errors.email) {
    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!errors.password) {
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    }
  }
  console.log(typeof data.type);
  console.log(data.type)
  if (Validator.isInt(data.type)) {
    if (data.type > 2) {
      errors.type = 'Invalid Type. Type cannot be greater than 2';
    }
  }

  if (!Validator.isInt(data.type)) {
    errors.type = 'Type field must be a number';
  }

  if (!data.type) {
    errors.type = 'Type field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateLoginInput = (input) => {
  const errors = {};
  const data = input;
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateMakeAdminInput = (input) => {
  const errors = {};
  const data = input;
  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateSignupInput,
  validateLoginInput,
  validateMakeAdminInput,
};
