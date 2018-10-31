'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _products = require('./routes/api/v1/products');

var _products2 = _interopRequireDefault(_products);

var _sales = require('./routes/api/v1/sales');

var _sales2 = _interopRequireDefault(_sales);

var _users = require('./routes/api/v1/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

// Body Parser Middleware
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use((0, _cors2.default)());

// Make uploads folder available publicly
app.use('/uploads', _express2.default.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Store Manager API' });
});

// Use morgan to log requests.
app.use((0, _morgan2.default)('dev'));

// using routes
app.use('/api/v1/products', _products2.default);
app.use('/api/v1/sales', _sales2.default);
app.use('/api/v1/users', _users2.default);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
  next();
});

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`sever listening on port ${port}`));

module.exports = app;