'use strict';

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('./isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateSignupInput = input => {
  const errors = {};
  const data = input;
  data.name = !(0, _isEmpty2.default)(data.name) ? data.name : '';
  data.email = !(0, _isEmpty2.default)(data.email) ? data.email : '';
  data.password = !(0, _isEmpty2.default)(data.password) ? data.password : '';
  data.type = !(0, _isEmpty2.default)(data.type) ? data.type : '';

  if (!_validator2.default.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (_validator2.default.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (_validator2.default.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!errors.email) {
    if (!_validator2.default.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }
  }

  if (_validator2.default.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!errors.password) {
    if (!_validator2.default.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  if (_validator2.default.isEmpty(data.type)) {
    errors.type = 'Type field is required';
  }

  return {
    errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
};

const validateLoginInput = input => {
  const errors = {};
  const data = input;
  data.email = !(0, _isEmpty2.default)(data.email) ? data.email : '';
  data.password = !(0, _isEmpty2.default)(data.password) ? data.password : '';

  if (!_validator2.default.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (_validator2.default.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (_validator2.default.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
};

module.exports = {
  validateSignupInput,
  validateLoginInput
};