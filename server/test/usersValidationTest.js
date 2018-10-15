import chai from 'chai';
import chaiHttp from 'chai-http';

import usersValidation from '../validation/users';

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


describe('Register Validation', () => {
  it('returns empty object because all validation is passed', (done) => {
    const result = usersValidation.validateRegisterInput(
      {
        email: 'example@gmail.com', password: '123456', name: 'Example', type: '2',
      },
    );
    expect(result.isValid).to.equal(true);
    expect(Object.keys(result.errors).length).to.equal(0);
    done();
  });

  it('returns object of validation required', (done) => {
    const result = usersValidation.validateRegisterInput({});
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
