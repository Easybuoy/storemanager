import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Get All Sale Records', () => {
  it('returns array of all sale records', (done) => {
    chai.request(app).get('/api/v1/sales')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        done();
      });
  });
});

describe('Get A Sale Record', () => {
  it('returns details of a sale record', (done) => {
    const id = 2;
    chai.request(app).get(`/api/v1/sales/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(id).to.equal(res.body.id);

        done();
      });
  });

  it('return sale not found error', (done) => {
    const id = 89;
    chai.request(app).get(`/api/v1/sales/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(`Sales with id ${id} not found.`);

        done();
      });
  });
});

describe('Create New Sale Record', () => {
  it('create a new product', (done) => {
    chai.request(app).post('/api/v1/sales')
      .send({
        store_attendant_user_id: '1', product_id: '2',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Sale added successfully');

        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/sales')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.store_attendant_user_id).to.equal('Store Attendant User Id field is required');
        expect(res.body.product_id).to.equal('Product Id field is required');

        done();
      });
  });
});
