import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Get Products', () => {
  it('returns array of all products', (done) => {
    chai.request(app).get('/api/v1/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        done();
      });
  });
});

describe('Get A Product', () => {
  it('returns details of a product', (done) => {
    const id = 2;
    chai.request(app).get(`/api/v1/products/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(id).to.equal(res.body.id);

        done();
      });
  });

  it('return product not found error', (done) => {
    const id = 89;
    chai.request(app).get(`/api/v1/products/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(`Product with id ${id} not found.`);

        done();
      });
  });
});

describe('Create New Product', () => {
  it('create a new product', (done) => {
    chai.request(app).post('/api/v1/products')
      .send({
        name: 'Tecno', description: 'Tecno Phone', quantity: '2', price: '$200',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Product added successfully');

        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/products')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Name field is required');
        expect(res.body.description).to.equal('Description field is required');
        expect(res.body.price).to.equal('Price field is required');
        expect(res.body.quantity).to.equal('Quantity field is required');

        done();
      });
  });
});
