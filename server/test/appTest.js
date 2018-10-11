const { assert } = require('chai');

const app = require('../app');

// eslint-disable-next-line
describe('Basic Test', () => {
  // eslint-disable-next-line
  it('App should return hello', () => {
    assert.equal(app(), 'Hello');
  });
});
