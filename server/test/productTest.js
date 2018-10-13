const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
// let should = chai.should();

chai.use(chaiHttp);

const app = require('../app');

// eslint-disable-next-line
// describe('Basic Test', () => {
//   // eslint-disable-next-line
//   it('App should return hello', () => {
//     assert.equal(app(), 'Hello');
//   });
// });

describe('Get Products', () => {
  it('returns array of products', (done) => {
    chai.request(app).get('/api/v1/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.data.message).to.equal('Favourite added');

        // res.should.have.status(200);
        done();
      });
  });
});


describe('Create New Product', () => {
  it('create a new product', (done) => {
    chai.request(app).post('/api/v1/products')
      .send({ name: 'Tecno' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Product added successfully');

        // res.should.have.status(200);
        done();
      });
  });
});
