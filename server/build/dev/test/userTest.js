'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { expect } = _chai2.default;

_chai2.default.use(_chaiHttp2.default);

describe('User Routes', () => {
  let storeownertoken = '';
  before(done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
      email: 'example@gmail.com', password: '123456'
    }).end((err, res) => {
      const { token } = res.body;
      storeownertoken = token;
      done();
    });
  });

  it('create a user and return user details', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/signup').set('Authorization', storeownertoken).send({
      email: 'a@gmail.com',
      name: 'John Example',
      password: '123456',
      type: '1'
    }).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('User Created Successfully');
      done();
    });
  });

  it('return validation error if no data is sent', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/signup').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal('Email field is required');
      expect(res.body.password).to.equal('Password field is required');
      expect(res.body.name).to.equal('Name field is required');
      expect(res.body.type).to.equal('Type field is required');
      done();
    });
  });

  it('return email already exist', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/signup').set('Authorization', storeownertoken).send({
      email: 'example@gmail.com',
      name: 'John Example',
      password: '123456',
      type: '1'
    }).end((err, res) => {
      expect(res).to.have.status(409);
      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal('Email Already Exist');
      done();
    });
  });

  it('return token', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
      email: 'example@gmail.com',
      password: '123456'
    }).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.equal(true);
      expect(res.body.token).to.include('Bearer');
      done();
    });
  });

  it('return validation error if no data is sent', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal('Email field is required');
      expect(res.body.password).to.equal('Password field is required');
      done();
    });
  });

  it('return user not found', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
      email: 'example232@gmail.com',
      password: '123456'
    }).end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal('User Not Found');
      done();
    });
  });

  it('return incorrect password', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
      email: 'example@gmail.com',
      password: '1234'
    }).end((err, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.password).to.equal('Incorrect Password');
      done();
    });
  });

  it('returns details of current user', done => {
    _chai2.default.request(_app2.default).get('/api/v1/users/current').set('Authorization', storeownertoken).end((error, data) => {
      expect(data).to.have.status(200);
      expect(data.body).to.be.an('object');
      done();
    });
  });

  it('returns unauthorized because user is not logged in', done => {
    _chai2.default.request(_app2.default).get('/api/v1/users/current').end((error, data) => {
      expect(data).to.have.status(401);
      done();
    });
  });

  it('returns 404 error because post method is not allowed', done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/current').set('Authorization', storeownertoken).end((error, data) => {
      expect(data).to.have.status(404);
      done();
    });
  });
});