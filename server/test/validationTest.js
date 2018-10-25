import chai from 'chai';
import chaiHttp from 'chai-http';

import usersValidation from '../validation/users';
import productsValidation from '../validation/products';
import salesValidation from '../validation/sales';
import isEmpty from '../validation/isEmpty';

const { expect } = chai;

chai.use(chaiHttp);

describe('Login Validation', () => {
  it('returns empty object because all validation is passed', (done) => {
    const result = usersValidation.validateLoginInput({ email: 'example@gmail.com', password: '123456' });
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', (done) => {
    const result = usersValidation.validateLoginInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.email).to.equal('Email field is required');
    expect(result.errors.password).to.equal('Password field is required');
    expect(result.errors).to.be.an('object');
    done();
  });
});


describe('Signup Validation', () => {
  it('returns empty object because all validation is passed', (done) => {
    const result = usersValidation.validateSignupInput(
      {
        email: 'example@gmail.com', password: '123456', name: 'Example', type: '2',
      },
    );
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', (done) => {
    const result = usersValidation.validateSignupInput({});
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
  it('returns empty object because all validation is passed', (done) => {
    const result = productsValidation.validateProductInput(
      {
        name: 'Samsung Galaxy', description: 'Good Phone', price: '300', quantity: '29',
      },
    );
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', (done) => {
    const result = productsValidation.validateProductInput({});
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
  it('returns empty object because all validation is passed', (done) => {
    const result = salesValidation.validateSalesInput(
      {
        order: [{ product_id: '2', quantity: '5' }],
      },
    );
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', (done) => {
    const result = salesValidation.validateSalesInput({});
    expect(result.isValid).to.equal(false);
    expect(Object.keys(result.errors).length).to.be.greaterThan(0);
    expect(result.errors.order).to.equal('Order must be an array of object(s)');
    expect(result.errors).to.be.an('object');
    done();
  });
});


describe('isEmpty Function', () => {
  it('returns false because input passed is not empty', (done) => {
    const result = isEmpty('example@gmail.com');
    expect(result).to.equal(false);
    done();
  });

  it('returns true because input passed is empty', (done) => {
    const result = isEmpty('');
    expect(result).to.equal(true);
    done();
  });
});
