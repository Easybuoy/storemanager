import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Get All Sale Records', () => {
  let storeownertoken = '';
  let storeattendanttoken = '';
  let undefinedtypetoken = '';
  before((done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        storeownertoken = token;

        chai.request(app).post('/api/v1/auth/login')
          .send({
            email: 'example2@gmail.com', password: '123456',
          })
          .end((err2, res2) => {
            storeattendanttoken = res2.body.token;
            chai.request(app).post('/api/v1/auth/login')
              .send({
                email: 'example31@gmail.com', password: '123456',
              })
              .end((err3, res3) => {
                undefinedtypetoken = res3.body.token;
                done();
              });
          });
      });
  });

  it('create a new sale', (done) => {
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        const { id } = res.body.data[0];
        const id2 = res.body.data[1].id;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        chai.request(app).post('/api/v1/sales')
          .send({
            order: [{ quantity: 2, product_id: id }, { quantity: 8, product_id: id2 }],
          })
          .set('Authorization', storeattendanttoken)
          .end((error, data) => {
            expect(data).to.have.status(201);
            expect(data.body).to.be.an('object');
            expect(data.body.data.orders).to.be.an('array');
            expect(data.body.message).to.equal('Sale added successfully');
            done();
          });
      });
  });

  it('returns array of all sale records', (done) => {
    chai.request(app).get('/api/v1/sales')
      .set('Authorization', storeownertoken)
      .end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body.data).to.be.an('array');
        expect(data.body.data[0]).to.be.an('object');
        done();
      });
  });

  it('returns error because only store owner / admin has access to view all sales for getting all sales endpoint', (done) => {
    chai.request(app).get('/api/v1/sales')
      .set('Authorization', storeattendanttoken)
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
  });

  it('returns unauthorized because user is not logged in for getting all sales endpoint', (done) => {
    chai.request(app).get('/api/v1/sales')
      .end((error, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('returns details of a sale record', (done) => {
    chai.request(app).get('/api/v1/sales')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        const saleId = res.body.data[0].sale_id;
        chai.request(app).get(`/api/v1/sales/${saleId}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(200);
            // expect(saleId).to.equal(data.body.sale_id);
            // expect(data.body).to.be.an('object');
            done();
          });
      });
  });

//   it('returns unauthorized because he/she did not create the sale || is not store owner / admin', (done) => {
//     chai.request(app).get('/api/v1/sales/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         const { id } = res.body[0];
//         chai.request(app).get(`/api/v1/sales/${id}`)
//           .set('Authorization', undefinedtypetoken)
//           .end((error, data) => {
//             expect(data).to.have.status(401);
//             done();
//           });
//       });
//   });

//   it('return sale not found error', (done) => {
//     chai.request(app).get('/api/v1/sales/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         let { id } = res.body[0];
//         id = id.substring(2);
//         id = `93${id}`;
//         chai.request(app).get(`/api/v1/sales/${id}`)
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             expect(data).to.have.status(400);
//             expect(data.body).to.be.an('object');
//             expect(data.body.message).to.equal(`Sale with id ${id} not found.`);
//             done();
//           });
//       });
//   });

//   it('returns unauthorized because user is not logged in', (done) => {
//     const id = 2;
//     chai.request(app).get(`/api/v1/sales/${id}`)
//       .end((error, res) => {
//         expect(res).to.have.status(401);
//         done();
//       });
//   });

  

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/sales')
      .set('Authorization', storeattendanttoken)
      .end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        done();
      });
  });

  it('return error because quantity of product requested is more than quantity in store', (done) => {
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        const { id } = res.body.data[0];
        const id2 = res.body.data[1].id;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', storeattendanttoken)
          .send({
            order: [{ quantity: 2000000, product_id: id }, { quantity: 8, product_id: id2 }],
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
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        let { id } = res.body.data[0];
        id = id.substring(2);
        id = `93${id}`;
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        chai.request(app).post('/api/v1/sales')
          .set('Authorization', storeattendanttoken)
          .send({
            order: [{ quantity: 200, product_id: id }],
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
    chai.request(app).post('/api/v1/sales')
      .set('Authorization', storeownertoken)
      .send({
        order: [{ quantity: 2, product_id: 2 }, { quantity: 8, product_id: 3 }],
      })
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
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
