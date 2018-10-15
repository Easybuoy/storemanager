import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Register Route', () => {
  it('create a user and return user details', (done) => {
    chai.request(app).post('/api/v1/users/register')
      .send({
        email: 'a@gmail.com',
        name: 'John Example',
        password: '123456',
        type: '1',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('User Created Successfully');
        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/users/register')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal('Email field is required');
        expect(res.body.password).to.equal('Password field is required');
        expect(res.body.name).to.equal('Name field is required');
        expect(res.body.type).to.equal('Type field is required');

        done();
      });
  });

  it('return email already exist', (done) => {
    chai.request(app).post('/api/v1/users/register')
      .send({
        email: 'example@gmail.com',
        name: 'John Example',
        password: '123456',
        type: '1',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal('Email Already Exist');
        done();
      });
  });
});


describe('Login Route', () => {
  it('return token', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.token).to.include('Bearer');

        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal('Email field is required');
        expect(res.body.password).to.equal('Password field is required');

        done();
      });
  });

  it('return user not found', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example2@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal('User Not Found');
        done();
      });
  });

  it('return incorrect password', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '1234',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body.password).to.equal('Incorrect Password');
        done();
      });
  });
});
