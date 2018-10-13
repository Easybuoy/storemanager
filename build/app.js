'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var products = require('./routes/api/v1/products');
var sales = require('./routes/api/v1/sales');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     console.log('chheeii')
// res.send('Loaded');
// });

// using routes
app.use('/api/v1/products', products);
app.use('/api/v1/sales', sales);

var port = process.env.PORT || 3000;

app.listen(port, function () {
  return console.log('sever listening on port ' + port);
});

module.exports = app;