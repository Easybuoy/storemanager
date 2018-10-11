const express = require('express');
const app = express();

app.get('/', (req, res) => {
res.send('Loaded')
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`sever listening on port ${port}`)); 