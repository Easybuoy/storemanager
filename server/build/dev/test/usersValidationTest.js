'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _users = require('../validation/users');

var _users2 = _interopRequireDefault(_users);

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

describe('Login Validation', () => {
  it('returns empty object because all validation is passed', done => {
    const result = _users2.default.validateLoginInput({
      email: 'example@gmail.com', password: '123456', name: 'Example', type: '2'
    });
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