import express from 'express';
import bodyParser from 'body-parser';

import products from './routes/api/v1/products';
import sales from './routes/api/v1/sales';

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('Welcome To Store Manager API');
});

// using routes
app.use('/api/v1/products', products);
app.use('/api/v1/sales', sales);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`sever listening on port ${port}`));

module.exports = app;
