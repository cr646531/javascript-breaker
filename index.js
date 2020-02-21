const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// static resources
app.use(express.static(__dirname + "/public"));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// main route
app.get('/', (req, res) => res.sendFile('index.html'));

// listen on port
app.listen(port, ()=> console.log(`listening on port ${port}`));