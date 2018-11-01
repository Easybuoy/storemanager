import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Product Route', () => {
  let storeownertoken = '';
  let storeattendanttoken = '';
  before((done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        storeownertoken = token;

        chai.request(app).post('/api/v1/users/login')
          .send({
            email: 'example2@gmail.com', password: '123456',
          })
          .end((err2, res2) => {
            storeattendanttoken = res2.body.token;
            done();
          });
      });
  });

  it('returns array of all products', (done) => {
    chai.request(app).get('/api/v1/products')
      .set('Authorization', storeownertoken)
      .end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body.data).to.be.an('array');
        expect(data.body.data[0]).to.be.an('object');
        done();
      });
  });

  it('returns unauthorized because user is not logged in', (done) => {
    chai.request(app).get('/api/v1/products')
      .end((error, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });


  it('returns details of a product', (done) => {
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        const { id } = res.body.data[0];
        chai.request(app).get(`/api/v1/products/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(200);
            expect(id).to.equal(data.body.data.id);
            expect(data.body.data).to.be.an('object');
            expect(data.body.data.description).to.be.a('string');
            done();
          });
      });
  });

  it('return product not found error', (done) => {
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        let { id } = res.body.data[0];
        id = id.substring(2);
        id = `93${id}`;
        chai.request(app).get(`/api/v1/products/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal(`Product with id ${id} not found.`);
            done();
          });
      });
  });

  it('return error fetching product error', (done) => {
    chai.request(app).get('/api/v1/products/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        let { id } = res.body.data[0];
        id = `93${id}`;
        chai.request(app).get(`/api/v1/products/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('Error Fetching Products Details, Please try again');
            done();
          });
      });
  });


  it('returns unauthorized because user is not logged in', (done) => {
    const id = 2;
    chai.request(app).get(`/api/v1/products/${id}`)
      .end((error, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('return unauthorized because user is not admin', (done) => {
    chai.request(app).post('/api/v1/products')
      .set('Authorization', storeattendanttoken)
      .end((error, data) => {
        expect(data).to.have.status(401);
        expect(data.body.message).to.equal('Unauthorized');
        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/products')
      .set('Authorization', storeownertoken)
      .send({
        name: 'iPhone',
      })
      .end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body.data).to.be.an('object');
        expect(data.body.data.description).to.equal('Description field is required');
        expect(data.body.data.price).to.equal('Price field is required');
        expect(data.body.data.quantity).to.equal('Quantity field is required');
        done();
      });
  });

//   it('create a new product', (done) => {
//     chai.request(app).post('/api/v1/products')
//       .send({
//         name: 'Tecno', description: 'Tecno Phone', quantity: 2000, price: 200,
//       })
//       .set('Authorization', storeownertoken)
//       .end((error, data) => {
//         expect(data).to.have.status(201);
//         expect(data.body).to.be.an('object');
//         expect(data.body.message).to.equal('Product added successfully');
//         done();
//       });
//   });

//   it('returns unauthorized because user is not logged in', (done) => {
//     chai.request(app).post('/api/v1/products')
//       .send({
//         name: 'Tecno', description: 'Tecno Phone', quantity: 2, price: 200,
//       })
//       .end((error, res) => {
//         expect(res).to.have.status(401);
//         done();
//       });
//   });

//   it('should delete a product', (done) => {
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         const { id } = res.body[0];
//         chai.request(app).del(`/api/v1/products/${id}`)
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             expect(data).to.have.status(200);
//             expect(data.body).to.be.an('object');
//             expect(data.body.message).to.equal(`Product with id ${id} deleted successfully.`);
//             done();
//           });
//       });
//   });

//   it('should return unauthorized because user does not have right access', (done) => {
//     chai.request(app).del('/api/v1/products/3')
//       .set('Authorization', storeattendanttoken)
//       .end((error, data) => {
//         expect(data).to.have.status(401);
//         done();
//       });
//   });

//   it('should return product not found for delete route', (done) => {
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         let { id } = res.body[0];
//         id = id.substring(2);
//         id = `93${id}`;
//         chai.request(app).del(`/api/v1/products/${id}`)
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             expect(data).to.have.status(400);
//             expect(data.body).to.be.an('object');
//             expect(data.body.message).to.equal(`Product with id ${id} not found.`);
//             done();
//           });
//       });
//   });

//   it('should return error deleting product', (done) => {
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         let { id } = res.body[0];
//         id = `93${id}`;
//         chai.request(app).del(`/api/v1/products/${id}`)
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             expect(data).to.have.status(400);
//             expect(data.body).to.be.an('object');
//             expect(data.body.message).to.equal('Error Deleting Products, Please try again');
//             done();
//           });
//       });
//   });

//   it('should return update a product detail', (done) => {
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         const { id } = res.body[0];
//         chai.request(app).put(`/api/v1/products/${id}`)
//           .set('Authorization', storeownertoken)
//           .send({
//             name: 'Curve 4', description: 'Old Phone', quantity: 100, price: 300,
//           })
//           .end((error, data) => {
//             expect(data).to.have.status(200);
//             expect(data.body).to.be.an('object');
//             done();
//           });
//       });
//   });

//   it('should return error updating product', (done) => {
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         let { id } = res.body[0];
//         id = `93${id}`;
//         chai.request(app).put(`/api/v1/products/${id}`)
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             expect(data).to.have.status(400);
//             expect(data.body).to.be.an('object');
//             expect(data.body.message).to.equal('Error Updating Products, Please try again');
//             done();
//           });
//       });
//   });

//   it('should assign a product to category', (done) => {
//     let id = '';
//     let categoryId = '';
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         // eslint-disable-next-line
//         id = res.body[0].id;
//         chai.request(app).get('/api/v1/categories/')
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             categoryId = data.body[0].id;
//             expect(data).to.have.status(200);
//             expect(data.body).to.be.an('array');
//             chai.request(app).put(`/api/v1/products/${id}/${categoryId}`)
//               .set('Authorization', storeownertoken)
//               .end((error2, data2) => {
//                 expect(data2).to.have.status(200);
//                 expect(data2.body).to.be.an('object');
//                 expect(data2.body.message).to.equal('Product assigned to category successfully');
//                 done();
//               });
//           });
//       });
//   });

//   it('should return product not found error', (done) => {
//     let id = '';
//     let categoryId = '';
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         // eslint-disable-next-line
//         id = res.body[0].id;
//         id = id.substring(2);
//         id = `93${id}`;
//         chai.request(app).get('/api/v1/categories/')
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             categoryId = data.body[0].id;
//             expect(data).to.have.status(200);
//             expect(data.body).to.be.an('array');
//             chai.request(app).put(`/api/v1/products/${id}/${categoryId}`)
//               .set('Authorization', storeownertoken)
//               .end((error2, data2) => {
//                 expect(data2).to.have.status(400);
//                 expect(data2.body).to.be.an('object');
//                 expect(data2.body.message).to.equal(`Product with id ${id} not found.`);
//                 done();
//               });
//           });
//       });
//   });

//   it('should assign a product to category', (done) => {
//     let id = '';
//     let categoryId = '';
//     chai.request(app).get('/api/v1/products/')
//       .set('Authorization', storeownertoken)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         // eslint-disable-next-line
//         id = res.body[0].id;
//         chai.request(app).get('/api/v1/categories/')
//           .set('Authorization', storeownertoken)
//           .end((error, data) => {
//             categoryId = data.body[0].id;
//             categoryId = categoryId.substring(2);
//             categoryId = `93${categoryId}`;
//             expect(data).to.have.status(200);
//             expect(data.body).to.be.an('array');
//             chai.request(app).put(`/api/v1/products/${id}/${categoryId}`)
//               .set('Authorization', storeownertoken)
//               .end((error2, data2) => {
//                 expect(data2).to.have.status(400);
//                 expect(data2.body).to.be.an('object');
//                 expect(data2.body.message).to.equal(`Category with id ${categoryId} not found.`);
//                 done();
//               });
//           });
//       });
//   });
});
