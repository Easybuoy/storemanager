'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { expect } = _chai2.default;

_chai2.default.use(_chaiHttp2.default);

describe('App', () => {
  it('returns welcome to API message', done => {
    _chai2.default.request(_app2.default).get('/').end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Welcome To Store Manager API');
    });
    done();
  });

  it('returns 404 because route does not exist', done => {
    _chai2.default.request(_app2.default).post('/').end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body.error.message).to.equal('Not found');
    });
    done();
  });
});