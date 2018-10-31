'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _users = require('../validation/users');

var _users2 = _interopRequireDefault(_users);

var _products = require('../validation/products');

var _products2 = _interopRequireDefault(_products);

var _sales = require('../validation/sales');

var _sales2 = _interopRequireDefault(_sales);

var _isEmpty = require('../validation/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { expect } = _chai2.default;

_chai2.default.use(_chaiHttp2.default);

describe('Login Validation', () => {
  it('returns empty object because all validation is passed', done => {
    const result = _users2.default.validateLoginInput({ email: 'example@gmail.com', password: '123456' });
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', done => {
    const result = _users2.default.validateLoginInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.email).to.equal('Email field is required');
    expect(result.errors.password).to.equal('Password field is required');
    expect(result.errors).to.be.an('object');
    done();
  });
});

describe('Signup Validation', () => {
  it('returns empty object because all validation is passed', done => {
    const result = _users2.default.validateSignupInput({
      email: 'example@gmail.com', password: '123456', name: 'Example', type: '2'
    });
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', done => {
    const result = _users2.default.validateSignupInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.email).to.equal('Email field is required');
    expect(result.errors.password).to.equal('Password field is required');
    expect(result.errors.name).to.equal('Name field is required');
    expect(result.errors.type).to.equal('Type field is required');
    expect(result.errors).to.be.an('object');
    done();
  });
});

describe('Product Validation', () => {
  it('returns empty object because all validation is passed', done => {
    const result = _products2.default.validateProductInput({
      name: 'Samsung Galaxy', description: 'Good Phone', price: '300', quantity: '29'
    });
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', done => {
    const result = _products2.default.validateProductInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.name).to.equal('Name field is required');
    expect(result.errors.description).to.equal('Description field is required');
    expect(result.errors.price).to.equal('Price field is required');
    expect(result.errors.quantity).to.equal('Quantity field is required');
    expect(result.errors).to.be.an('object');
    done();
  });
});

describe('Sales Validation', () => {
  it('returns empty object because all validation is passed', done => {
    const result = _sales2.default.validateSalesInput({
      order: [{ product_id: '2', quantity: '5' }]
    });
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', done => {
    const result = _sales2.default.validateSalesInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.order).to.equal('Order must be an array of object(s)');
    expect(result.errors).to.be.an('object');
    done();
  });
});

describe('isEmpty Function', () => {
  it('returns false because input passed is not empty', done => {
    const result = (0, _isEmpty2.default)('example@gmail.com');
    expect(result).to.equal(false);
    done();
  });

  it('returns true because input passed is empty', done => {
    const result = (0, _isEmpty2.default)('');
    expect(result).to.equal(true);
    done();
  });
});