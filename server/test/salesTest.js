import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Get All Sale Records', () => {
  it('returns array of all sale records', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).get('/api/v1/sales')
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(200);
            expect(data.body).to.be.an('array');
            done();
          });
      });
  });

  it('returns error because only store owner / admin has access to view all sales', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).get('/api/v1/sales')
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(401);
            done();
          });
      });
  });

  it('returns unauthorized because user is not logged in', (done) => {
    chai.request(app).get('/api/v1/sales')
      .end((error, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('Get A Sale Record', () => {
  it('returns details of a sale record', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        const id = 2;
        chai.request(app).get(`/api/v1/sales/${id}`)
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(200);
            expect(id).to.equal(data.body.id);
            done();
          });
      });
  });

  it('returns unauthorized because he/she did not create the sale || is not store owner / admin', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example3@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        const id = 2;
        chai.request(app).get(`/api/v1/sales/${id}`)
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(401);
            done();
          });
      });
  });

  it('return sale not found error', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        const id = 299;
        chai.request(app).get(`/api/v1/sales/${id}`)
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal(`Sales with id ${id} not found.`);
            done();
          });
      });
  });

  it('returns unauthorized because user is not logged in', (done) => {
    const id = 2;
    chai.request(app).get(`/api/v1/sales/${id}`)
      .end((error, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('Create New Sale Record', () => {
  it('create a new sale', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/sales')
          .send({
            order: [{ quantity: 2, product_id: 2 }, { quantity: 8, product_id: 1 }],
          })
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(201);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('Sale added successfully');
            done();
          });
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            done();
          });
      });
  });

  it('return error because quantity of product requested is more than quantity in store', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', token)
          .send({
            order: [{ quantity: 200, product_id: 2 }, { quantity: 8, product_id: 1 }],
          })
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('One Of Product Requested Is More Than In Stock');
            done();
          });
      });
  });

  it('return error because one of product requested is not available in store', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', token)
          .send({
            order: [{ quantity: 200, product_id: 299 }, { quantity: 8, product_id: 3 }],
          })
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('One Of Product Requested Is Not Available');
            done();
          });
      });
  });

  it('return unauthorized because only store attendant can create a sale record', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', token)
          .send({
            order: [{ quantity: 2, product_id: 2 }, { quantity: 8, product_id: 3 }],
          })
          .end((error, data) => {
            expect(data).to.have.status(401);
            done();
          });
      });
  });

  it('returns unauthorized because user is not logged in', (done) => {
    chai.request(app).post('/api/v1/sales')
      .end((error, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
