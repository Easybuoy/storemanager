const express = require('express');
const bodyParser = require('body-parser');

const app = express();


const products = require('./routes/api/v1/products');
const sales = require('./routes/api/v1/sales');


//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

// app.get('/', (req, res) => {
// res.send('Loaded')
// });

//using routes
app.use('/api/v1/products',products);
app.use('/api/v1/sales',sales);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`sever listening on port ${port}`)); 