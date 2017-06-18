'use strict'; 

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
        console.log(`Your app is listening on port ${port}`);
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
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(); 
      });
    });
  });
}

app.get('/priorities/all', (req, res) => { 
  Priorities
    .find()
    .exec()
    .then(priorities => {
      res.json(priorities.map((priorities) => priorities));
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

app.post('/priorities/create', (req, res) => {
  const requiredFields = ['goal', 'completed', 'date_committed'];
  for (var i=0; i<requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Priorities
    .create({
      goal: req.body.goal,
      completed: req.body.completed,
      date_committed: req.body.date_committed
    })
    .then(
      priority => res.status(201).json(priority))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.delete('/priorities/:id', (req, res) => {
  Priorities
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(priority => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});





app.use(express.static('public'));


if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
