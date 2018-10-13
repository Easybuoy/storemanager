'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;
// let should = chai.should();

chai.use(chaiHttp);

var app = require('../app');

// eslint-disable-next-line
// describe('Basic Test', () => {
//   // eslint-disable-next-line
//   it('App should return hello', () => {
//     assert.equal(app(), 'Hello');
//   });
// });

describe('Get Products', function () {
  it('returns array of products', function (done) {
    chai.request(app).get('/api/v1/products').end(function (err, res) {
      expect(res).to.have.status(200);
      // expect(res.body.data.message).to.equal('Favourite added');

      // res.should.have.status(200);
      done();
    });
  });
});

describe('Create New Product', function () {
  it('create a new product', function (done) {
    chai.request(app).post('/api/v1/products').send({ name: 'Tecno' }).end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.body.message).to.equal('Product added successfully');

      // res.should.have.status(200);
      done();
    });
  });
});