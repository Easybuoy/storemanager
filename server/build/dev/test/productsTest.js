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

describe('Product Route', () => {
  let storeownertoken = '';
  let storeattendanttoken = '';
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
        done();
      });
    });
  });

  it('returns array of all products', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products').set('Authorization', storeownertoken).end((error, data) => {
      expect(data).to.have.status(200);
      expect(data.body).to.be.an('array');
      done();
    });
  });

  // it('returns error fetching products', (done) => {
  //   chai.request(app).get('/api/v1/products')
  //     .set('Authorization', storeownertoken)
  //     .end((error, data) => {
  //       expect(data).to.have.status(400);
  //       expect(data.body).to.be.an('object');
  //       done();
  //     });
  // });

  it('returns unauthorized because user is not logged in', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products').end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('returns details of a product', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      const { id } = res.body[0];
      _chai2.default.request(_app2.default).get(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(200);
        expect(id).to.equal(data.body.id);
        done();
      });
    });
  });

  it('return product not found error', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = id.substring(2);
      id = `93${id}`;
      _chai2.default.request(_app2.default).get(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal(`Product with id ${id} not found.`);
        done();
      });
    });
  });

  it('return error fetching product error', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = `93${id}`;
      _chai2.default.request(_app2.default).get(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('Error Fetching Products Details, Please try again');
        done();
      });
    });
  });

  it('returns unauthorized because user is not logged in', done => {
    const id = 2;
    _chai2.default.request(_app2.default).get(`/api/v1/products/${id}`).end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('return unauthorized because user is not admin', done => {
    _chai2.default.request(_app2.default).post('/api/v1/products').set('Authorization', storeattendanttoken).end((error, data) => {
      expect(data).to.have.status(401);
      expect(data.body.message).to.equal('Unauthorized');
      done();
    });
  });

  it('return validation error if no data is sent', done => {
    _chai2.default.request(_app2.default).post('/api/v1/products').set('Authorization', storeownertoken).send({
      name: 'iPhone'
    }).end((error, data) => {
      expect(data).to.have.status(400);
      expect(data.body).to.be.an('object');
      expect(data.body.description).to.equal('Description field is required');
      expect(data.body.price).to.equal('Price field is required');
      expect(data.body.quantity).to.equal('Quantity field is required');
      done();
    });
  });

  it('create a new product', done => {
    _chai2.default.request(_app2.default).post('/api/v1/products').send({
      name: 'Tecno', description: 'Tecno Phone', quantity: '2000', price: '200'
    }).set('Authorization', storeownertoken).end((error, data) => {
      expect(data).to.have.status(201);
      expect(data.body).to.be.an('object');
      expect(data.body.message).to.equal('Product added successfully');
      done();
    });
  });

  it('returns unauthorized because user is not logged in', done => {
    _chai2.default.request(_app2.default).post('/api/v1/products').send({
      name: 'Tecno', description: 'Tecno Phone', quantity: '2', price: '$200'
    }).end((error, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });

  it('should delete a product', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      const { id } = res.body[0];
      _chai2.default.request(_app2.default).del(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal(`Product with id ${id} deleted successfully.`);
        done();
      });
    });
  });

  it('should return unauthorized because user does not have right access', done => {
    _chai2.default.request(_app2.default).del('/api/v1/products/3').set('Authorization', storeattendanttoken).end((error, data) => {
      expect(data).to.have.status(401);
      done();
    });
  });

  it('should return product not found for delete route', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = id.substring(2);
      id = `93${id}`;
      _chai2.default.request(_app2.default).del(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal(`Product with id ${id} not found.`);
        done();
      });
    });
  });

  it('should return error deleting product', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = `93${id}`;
      _chai2.default.request(_app2.default).del(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('Error Deleting Products, Please try again');
        done();
      });
    });
  });

  it('should return update a product detail', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      const { id } = res.body[0];
      _chai2.default.request(_app2.default).put(`/api/v1/products/${id}`).set('Authorization', storeownertoken).send({
        name: 'Curve 4', description: 'Old Phone', quantity: 100, price: 300
      }).end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body).to.be.an('object');
        done();
      });
    });
  });

  it('should return error updating product', done => {
    _chai2.default.request(_app2.default).get('/api/v1/products/').set('Authorization', storeownertoken).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      let { id } = res.body[0];
      id = `93${id}`;
      _chai2.default.request(_app2.default).put(`/api/v1/products/${id}`).set('Authorization', storeownertoken).end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('Error Updating Products, Please try again');
        done();
      });
    });
  });
});