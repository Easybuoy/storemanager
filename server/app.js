import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import products from './routes/api/v1/products';
import sales from './routes/api/v1/sales';
import users from './routes/api/v1/users';

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Make uploads folder available publicly
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Store Manager API' });
});

// Use morgan to log requests.
app.use(morgan('dev'));

// Passport middlewaare
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// using routes
app.use('/api/v1/products', products);
app.use('/api/v1/sales', sales);
app.use('/api/v1/users', users);

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