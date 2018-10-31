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

describe('Get All Sale Records', () => {
  let storeownertoken = '';
  let storeattendanttoken = '';
  let undefinedtypetoken = '';
  before(done => {
    _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
      email: 'example@gmail.com', password: '123456'
    }).end((err, res) => {
      const { token } = res.body;
      storeownertoken = token;

      _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
        email: 'example2@gmail.com', password: '123456'
      }).end((err2, res2) => {
        storeattendanttoken = res2.body.token;
        _chai2.default.request(_app2.default).post('/api/v1/users/login').send({
          email: 'example31@gmail.com', password: '123456'
        }).end((err3, res3) => {
          undefinedtypetoken = res3.body.token;
          done();
        });
      });
    });
  });

  it('returns array of all sale records', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales').set('Authorization', storeownertoken).end((error, data) => {
      expect(data).to.have.status(200);
      expect(data.body).to.be.an('array');
      done();
    });
  });

  it('returns error because only store owner / admin has access to view all sales for getting all sales endpoint', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales').set('Authorization', storeattendanttoken).end((error, data) => {
      expect(data).to.have.status(401);
      done();
    });
  });

  it('returns unauthorized because user is not logged in for getting all sales endpoint', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales').end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('returns details of a sale record', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      const { id } = res.body[0];
      _chai2.default.request(_app2.default).get(`/api/v1/sales/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(200);
        expect(id).to.equal(data.body.id);
        done();
      });
    });
  });

  it('returns unauthorized because he/she did not create the sale || is not store owner / admin', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      const { id } = res.body[0];
      _chai2.default.request(_app2.default).get(`/api/v1/sales/${id}`).set('Authorization', undefinedtypetoken).end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
    });
  });

  it('return sale not found error', done => {
    _chai2.default.request(_app2.default).get('/api/v1/sales/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = id.substring(2);
      id = `93${id}`;
      _chai2.default.request(_app2.default).get(`/api/v1/sales/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal(`Sale with id ${id} not found.`);
        done();
      });
    });
  });

  it('returns unauthorized because user is not logged in', done => {
    const id = 2;
    _chai2.default.request(_app2.default).get(`/api/v1/sales/${id}`).end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('create a new sale', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      const { id } = res.body[0];
      const id2 = res.body[1].id;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      _chai2.default.request(_app2.default).post('/api/v1/sales').send({
        order: [{ quantity: 2, product_id: id }, { quantity: 8, product_id: id2 }]
      }).set('Authorization', storeattendanttoken).end((error, data) => {
        expect(data).to.have.status(201);
        expect(data.body).to.be.an('object');
        expect(data.body.data.orders).to.be.an('array');
        expect(data.body.message).to.equal('Sale added successfully');
        done();
      });
    });
  });

  it('return validation error if no data is sent', done => {
    _chai2.default.request(_app2.default).post('/api/v1/sales').set('Authorization', storeattendanttoken).end((error, data) => {
      expect(data).to.have.status(400);
      expect(data.body).to.be.an('object');
      done();
    });
  });

  it('return error because quantity of product requested is more than quantity in store', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      const { id } = res.body[0];
      const id2 = res.body[1].id;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      _chai2.default.request(_app2.default).post('/api/v1/sales').set('Authorization', storeattendanttoken).send({
        order: [{ quantity: 2000000, product_id: id }, { quantity: 8, product_id: id2 }]
      }).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('One Of Product Requested Is More Than In Stock');
        done();
      });
    });
  });

  it('return error because one of product requested is not available in store', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      let { id } = res.body[0];
      id = id.substring(2);
      id = `93${id}`;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      _chai2.default.request(_app2.default).post('/api/v1/sales').set('Authorization', storeattendanttoken).send({
        order: [{ quantity: 200, product_id: id }]
      }).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('One Of Product Requested Is Not Available');
        done();
      });
    });
  });

  it('return unauthorized because only store attendant can create a sale record', done => {
    _chai2.default.request(_app2.default).post('/api/v1/sales').set('Authorization', storeownertoken).send({
      order: [{ quantity: 2, product_id: 2 }, { quantity: 8, product_id: 3 }]
    }).end((error, data) => {
      expect(data).to.have.status(401);
      done();
    });
  });

  it('returns unauthorized because user is not logged in', done => {
    _chai2.default.request(_app2.default).post('/api/v1/sales').end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });
});