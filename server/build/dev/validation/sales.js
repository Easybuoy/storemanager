'use strict';

var _isEmpty = require('./isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateSalesInput = input => {
  const errors = {};
  const data = input;
  data.quantity = !(0, _isEmpty2.default)(data.quantity) ? data.quantity : '';
  data.product_id = !(0, _isEmpty2.default)(data.product_id) ? data.product_id : '';

  if (!Array.isArray(data.order)) {
    errors.order = 'Order must be an array of object(s)';
  }

  return {
    errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
};

module.exports = {
  validateSalesInput
};