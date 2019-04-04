import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('User Routes', () => {
  let storeownertoken = '';
  let storeattendanttoken = '';
  let undefinedtypetoken = '';

  before((done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@gmail.com', password: '123456',
      })
      .end((err, res) => {
        const { token } = res.body.data;
        storeownertoken = token;

        chai.request(app).post('/api/v1/auth/login')
          .send({
            email: 'example2@gmail.com', password: '123456',
          })
          .end((err2, res2) => {
            storeattendanttoken = res2.body.data.token;
            chai.request(app).post('/api/v1/auth/login')
              .send({
                email: 'example31@gmail.com', password: '123456',
              })
              .end((err3, res3) => {
                undefinedtypetoken = res3.body.data.token;
                done();
              });
          });
      });
  });

  it('create a user and return user details', (done) => {
    chai.request(app).post('/api/v1/auth/signup')
      .set('Authorization', storeownertoken)
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
    chai.request(app).post('/api/v1/auth/signup')
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
    chai.request(app).post('/api/v1/auth/signup')
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
    chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.data.token).to.include('Bearer');
        done();
      });
  });

  it('return validation error if no data is sent', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.data.email).to.equal('Email field is required');
        expect(res.body.data.password).to.equal('Password field is required');
        done();
      });
  });

  it('return user not found', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'example232@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.data.email).to.equal('User Not Found');
        done();
      });
  });

  it('return incorrect password', (done) => {
    chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@gmail.com',
        password: '1234',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body.data.password).to.equal('Incorrect Password');
        done();
      });
  });


  it('make a store attendant an admin', (done) => {
    chai.request(app).post('/api/v1/auth/makeadmin')
      .set('Authorization', storeownertoken)
      .send({ email: 'example32@gmail.com' })
      .end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('Attendant switched to Admin successfully');
        expect(data.body.data).to.be.an('object');
        done();
      });
  });

  it('return user not found error whilst trying to make store attendant an admin', (done) => {
    chai.request(app).post('/api/v1/auth/makeadmin')
      .set('Authorization', storeownertoken)
      .send({ email: 'example3222@gmail.com' })
      .end((error, data) => {
        expect(data).to.have.status(404);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('User Not Found');
        done();
      });
  });

  it('return user is already an admin whilst trying to make store attendant an admin', (done) => {
    chai.request(app).post('/api/v1/auth/makeadmin')
      .set('Authorization', storeownertoken)
      .send({ email: 'example@gmail.com' })
      .end((error, data) => {
        expect(data).to.have.status(400);
        expect(data.body).to.be.an('object');
        expect(data.body.message).to.equal('User already an admin');
        done();
      });
  });

  it('return unauthorized whilst trying to make store attendant an admin', (done) => {
    chai.request(app).post('/api/v1/auth/makeadmin')
      .send({ email: 'example@gmail.com' })
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
  });

  it('get all store attendants', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((error, data) => {
        expect(data).to.have.status(200);
        expect(data.body.data).to.be.an('array');
        expect(data.body.data[0]).to.be.an('object');
        done();
      });
  });

  it('does not delete attendant because attendant was not found', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        let attendantId = res.body.data[0].id;
        attendantId = attendantId.substring(2);
        attendantId = `93${attendantId}`;
        chai.request(app).del(`/api/v1/auth/attendant/${attendantId}`)
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(400);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal(`User with id ${attendantId} not found.`);
            done();
          });
      });
  });

  it('deletes a sale attendant', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        const attendantId = res.body.data[1].id;
        chai.request(app).del(`/api/v1/auth/attendant/${attendantId}`)
          .set('Authorization', storeownertoken)
          .end((err2, res2) => {
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body.message).to.equal(`User with id ${attendantId} deleted successfully.`);
            done();
          });
      });
  });

  it('return unauthorized whilst trying to get user by id', (done) => {
    chai.request(app).get('/api/v1/auth/2')
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
  });

  it('should return unauthorized because user does not have right access', (done) => {
    chai.request(app).get('/api/v1/auth/3')
      .set('Authorization', storeattendanttoken)
      .end((error, data) => {
        expect(data).to.have.status(401);
        done();
      });
  });

  it('returns details of a user', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        const { id } = res.body.data[0];
        chai.request(app).get(`/api/v1/auth/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(200);
            expect(id).to.equal(data.body.data.id);
            expect(data.body.data).to.be.an('object');
            expect(data.body.data.name).to.be.a('string');
            done();
          });
      });
  });

  it('return user not found error', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        let { id } = res.body.data[0];
        id = id.substring(2);
        id = `93${id}`;
        chai.request(app).get(`/api/v1/auth/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal(`User with id ${id} not found.`);
            done();
          });
      });
  });

  it('return error fetching user error', (done) => {
    chai.request(app).get('/api/v1/auth/attendants')
      .set('Authorization', storeownertoken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        let { id } = res.body.data[0];
        id = `93${id}`;
        chai.request(app).get(`/api/v1/auth/${id}`)
          .set('Authorization', storeownertoken)
          .end((error, data) => {
            expect(data).to.have.status(400);
            expect(data.body).to.be.an('object');
            expect(data.body.message).to.equal('Error Fetching User Details, Please try again');
            done();
          });
      });
  });

});
