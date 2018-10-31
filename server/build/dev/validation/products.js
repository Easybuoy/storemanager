'use strict';

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('./isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateProductInput = input => {
  const errors = {};
  const data = input;
  data.name = !(0, _isEmpty2.default)(data.name) ? data.name : '';
  data.description = !(0, _isEmpty2.default)(data.description) ? data.description : '';
  data.quantity = !(0, _isEmpty2.default)(data.quantity) ? data.quantity : '';
  data.price = !(0, _isEmpty2.default)(data.price) ? data.price : '';

  if (_validator2.default.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (_validator2.default.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  if (_validator2.default.isEmpty(data.price)) {
    errors.price = 'Price field is required';
  }

  if (_validator2.default.isEmpty(data.quantity)) {
    errors.quantity = 'Quantity field is required';
  }

  return {
    errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
};

module.exports = {
  validateProductInput
};