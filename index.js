const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => res.sendFile('index.html'));

app.listen(port, ()=> console.log(`listening on port ${port}`));