import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('App', () => {
  it('returns welcome to API message', (done) => {
    chai.request(app).get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome To Store Manager API');
        expect(res.body).to.be.an('object');
      });
    done();
  });

  it('returns 404 because route does not exist', (done) => {
    chai.request(app).post('/')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.message).to.equal('Not found');
        expect(res.body).to.be.an('object');
      });
    done();
  });
});
