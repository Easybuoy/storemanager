import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Categories Rutes', () => {
  let storeownertoken = '';
  before((done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        storeownertoken = token;
        done();
      });
  });

  it('return no category found', (done) => {
    chai.request(app).get('/api/v1/categories/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('No Category Found');
        done();
      });
  });

  it('create a new category', (done) => {
    chai.request(app).post('/api/v1/categories/')
      .set('Authorization', storeownertoken)
      .send({
        name: 'Fashions',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Category added successfully');
        expect(res.body.data).to.be.an('object');
        chai.request(app).post('/api/v1/categories/')
          .set('Authorization', storeownertoken)
          .send({
            name: 'Electronics',
          })
          .end((err2, data) => {
            expect(data).to.have.status(201);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('Category added successfully');
            expect(data.body.data).to.be.an('object');
            done();
          });
      });
  });

  it('return validation error if no data is sent whilst trying to create a category', (done) => {
    chai.request(app).post('/api/v1/categories')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Name field is required');
        done();
      });
  });

  it('returns category already exist', (done) => {
    const name = 'Fashions';
    chai.request(app).post('/api/v1/categories/')
      .set('Authorization', storeownertoken)
      .send({
        name,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(`Category with name ${name} already exists`);
        done();
      });
  });

  it('return unauthorized because token is not present', (done) => {
    chai.request(app).post('/api/v1/categories')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('returns all categories', (done) => {
    chai.request(app).get('/api/v1/categories/')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('updates a category', (done) => {
    chai.request(app).get('/api/v1/categories')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        const categoryId = res.body[0].id;
        chai.request(app).put(`/api/v1/categories/${categoryId}`)
          .send({
            name: 'Fashion',
          })
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal('Category Updated Successfully');
            done();
          });
      });
  });

  it('does not update category because category was not found', (done) => {
    chai.request(app).get('/api/v1/categories')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        let categoryId = res.body[0].id;
        categoryId = categoryId.substring(2);
        categoryId = `93${categoryId}`;
        chai.request(app).put(`/api/v1/categories/${categoryId}`)
          .send({
            name: 'Fashion',
          })
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(400);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal(`Category with id ${categoryId} not found.`);
            done();
          });
      });
  });

  it('does not delete category because category was not found', (done) => {
    chai.request(app).get('/api/v1/categories')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        let categoryId = res.body[0].id;
        categoryId = categoryId.substring(2);
        categoryId = `93${categoryId}`;
        chai.request(app).del(`/api/v1/categories/${categoryId}`)
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(400);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal(`Category with id ${categoryId} not found.`);
            done();
          });
      });
  });

  it('deletes a category', (done) => {
    chai.request(app).get('/api/v1/categories')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        const categoryId = res.body[0].id;
        chai.request(app).del(`/api/v1/categories/${categoryId}`)
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal(`Category with id ${categoryId} deleted successfully.`);
            done();
          });
      });
  });
});
