import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('User Routes', () => {
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

  it('create a user and return user details', (done) => {
    chai.request(app).post('/api/v1/users/signup')
      .set('Authorization', storeownertoken)
      .send({
        email: 'a@gmail.com',
        name: 'John Example',
        password: '123456',
        type: '1',
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('User Created Successfully');
        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/users/signup')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('error');
        expect(res.body.data.email).to.equal('Email field is required');
        expect(res.body.data.password).to.equal('Password field is required');
        expect(res.body.data.name).to.equal('Name field is required');
        expect(res.body.data.type).to.equal('Type field is required');
        done();
      });
  });

  it('return email already exist', (done) => {
    chai.request(app).post('/api/v1/users/signup')
      .set('Authorization', storeownertoken)
      .send({
        email: 'example@gmail.com',
        name: 'John Example',
        password: '123456',
        type: '1',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body.data.email).to.equal('Email Already Exist');
        done();
      });
  });

  it('return token', (done) => {
    chai.request(app).post('/api/v1/users/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.token).to.include('Bearer');
        done();
      });
  });

  // it('return validation error if no data is sent', (done) => {
  //   chai.request(app).post('/api/v1/users/login')
  //     .end((err, res) => {
  //       expect(res).to.have.status(400);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.email).to.equal('Email field is required');
  //       expect(res.body.password).to.equal('Password field is required');
  //       done();
  //     });
  // });

  // it('return user not found', (done) => {
  //   chai.request(app).post('/api/v1/users/login')
  //     .send({
  //       email: 'example232@gmail.com',
  //       password: '123456',
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(404);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.email).to.equal('User Not Found');
  //       done();
  //     });
  // });

  // it('return incorrect password', (done) => {
  //   chai.request(app).post('/api/v1/users/login')
  //     .send({
  //       email: 'example@gmail.com',
  //       password: '1234',
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(401);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.password).to.equal('Incorrect Password');
  //       done();
  //     });
  // });

  // it('returns details of current user', (done) => {
  //   chai.request(app).get('/api/v1/users/current')
  //     .set('Authorization', storeownertoken)
  //     .end((error, data) => {
  //       expect(data).to.have.status(200);
  //       expect(data.body).to.be.an('object');
  //       done();
  //     });
  // });

  // it('returns unauthorized because user is not logged in', (done) => {
  //   chai.request(app).get('/api/v1/users/current')
  //     .end((error, data) => {
  //       expect(data).to.have.status(401);
  //       done();
  //     });
  // });

  // it('returns 404 error because post method is not allowed', (done) => {
  //   chai.request(app).post('/api/v1/users/current')
  //     .set('Authorization', storeownertoken)
  //     .end((error, data) => {
  //       expect(data).to.have.status(404);
  //       done();
  //     });
  // });

  // it('make a store attendant an admin', (done) => {
  //   chai.request(app).post('/api/v1/users/makeadmin')
  //     .set('Authorization', storeownertoken)
  //     .send({ email: 'example32@gmail.com' })
  //     .end((error, data) => {
  //       expect(data).to.have.status(200);
  //       expect(data.body).to.be.an('object');
  //       expect(data.body.message).to.equal('Attendant switched to Admin successfully');
  //       expect(data.body.data).to.be.an('object');
  //       done();
  //     });
  // });

  // it('return user not found error whilst trying to make store attendant an admin', (done) => {
  //   chai.request(app).post('/api/v1/users/makeadmin')
  //     .set('Authorization', storeownertoken)
  //     .send({ email: 'example3222@gmail.com' })
  //     .end((error, data) => {
  //       expect(data).to.have.status(404);
  //       expect(data.body).to.be.an('object');
  //       expect(data.body.message).to.equal('User Not Found');
  //       done();
  //     });
  // });

  // it('return user is already an admin whilst trying to make store attendant an admin', (done) => {
  //   chai.request(app).post('/api/v1/users/makeadmin')
  //     .set('Authorization', storeownertoken)
  //     .send({ email: 'example@gmail.com' })
  //     .end((error, data) => {
  //       expect(data).to.have.status(400);
  //       expect(data.body).to.be.an('object');
  //       expect(data.body.message).to.equal('User already an admin');
  //       done();
  //     });
  // });

  // it('return unauthorized whilst trying to make store attendant an admin', (done) => {
  //   chai.request(app).post('/api/v1/users/makeadmin')
  //     .send({ email: 'example@gmail.com' })
  //     .end((error, data) => {
  //       expect(data).to.have.status(401);
  //       done();
  //     });
  // });

  // it('get all store attendants', (done) => {
  //   chai.request(app).get('/api/v1/users/attendants')
  //     .set('Authorization', storeownertoken)
  //     .end((error, data) => {
  //       expect(data).to.have.status(200);
  //       expect(data.body).to.be.an('array');
  //       expect(data.body[0]).to.be.an('object');
  //       done();
  //     });
  // });
});
