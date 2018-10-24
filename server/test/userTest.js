import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Signup Route', () => {
  it('create a user and return user details', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((loginerr, loginres) => {
        const { token } = loginres.body;
        expect(loginres).to.have.status(200);
        expect(loginres.body).to.be.an('object');
        expect(loginres.body.success).to.equal(true);
        expect(loginres.body.token).to.include('Bearer');

        chai.request(app).post('/api/v1/users/signup')
          .set('Authorization', token)
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
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((loginerr, loginres) => {
        const { token } = loginres.body;
        expect(loginres).to.have.status(200);
        expect(loginres.body).to.be.an('object');
        expect(loginres.body.success).to.equal(true);
        expect(loginres.body.token).to.include('Bearer');
        chai.request(app).post('/api/v1/users/signup')
          .set('Authorization', token)
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
  });

  it('return email already exist', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((loginerr, loginres) => {
        const { token } = loginres.body;
        expect(loginres).to.have.status(200);
        expect(loginres.body).to.be.an('object');
        expect(loginres.body.success).to.equal(true);
        expect(loginres.body.token).to.include('Bearer');
        chai.request(app).post('/api/v1/users/signup')
          .set('Authorization', token)
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
        email: 'example232@gmail.com',
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

describe('Get Current user', () => {
  it('returns details of current user', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).get('/api/v1/users/current')
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(200);
            expect(data.body).to.be.an('object');
            done();
          });
      });
  });

  it('returns unauthorized because user is not logged in', (done) => {
    chai.request(app).get('/api/v1/users/current')
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
  });

  it('returns 404 error because post method is not allowed', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        chai.request(app).post('/api/v1/users/current')
          .set('Authorization', token)
          .end((error, data) => {
            expect(data).to.have.status(404);
            done();
          });
      });
  });
});
