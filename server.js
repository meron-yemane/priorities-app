'use strict'; 

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function() {
  res.status(200).send("hello world");
});

app.listen(process.env.PORT || 8080, () => console.log("listening"));

module.exports = app;


