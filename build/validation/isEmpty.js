'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isEmpty = function isEmpty(value) {
  return value === undefined || value === null || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;
};

module.exports = isEmpty;