'use strict'; 

const express = require('express');
const moragn = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('bodyParser');
mongoose.Promise = global.Promise; 

const app = express();

const {PORT, DATABASE_URL} = require('./config');
const Priorities = require('./models');

app.use(bodyParser.json());
app.use(morgan('common'));

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log('Your app is listening on port ${port}');
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err)
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      sever.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(); 
      });
    });
  });
}








app.use(express.static('public'));

app.listen(process.env.PORT || 8080, () => console.log("listening"));

module.exports = app;
