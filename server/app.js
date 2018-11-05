import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import products from './routes/api/v1/products';
import sales from './routes/api/v1/sales';
import users from './routes/api/v1/auth';
import categories from './routes/api/v1/categories';

const app = express();

// Initialize cors
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Make assets folder available publicly
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Store Manager API' });
});

// Use morgan to log requests.
app.use(morgan('dev'));

app.use('/client', express.static(path.join(__dirname, '../client')));

// using routes
app.use('/api/v1/products', products);
app.use('/api/v1/sales', sales);
app.use('/api/v1/auth', users);
app.use('/api/v1/categories', categories);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
  next();
});

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`sever listening on port ${port}`));

module.exports = app;
