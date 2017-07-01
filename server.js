'use strict'; 
var sessionOpts = {
  saveUninitialized: false, 
  resave: false, // do not automatically write to the session store
  cookie: {httpOnly: true}
}

const {Users} = require('./models');

const express = require('express');
const session = require('express-session');//creates a session middleware
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
mongoose.Promise = global.Promise; 

const app = express();

const {PORT, DATABASE_URL} = require('./config');
const {userRouter} = require('./user-router');
const {prioritiesRouter} = require('./priorities-router');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('common'));
app.use(session({ secret: 'best ever' }));
app.use(session(sessionOpts));
app.use(flash());

//response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);

app.use(passport.initialize());//required to initialize passport
app.use(passport.session());//required for persistent login sessions

app.use('/users/', userRouter);
app.use('/priorities/', prioritiesRouter);

// serializeUser ensures that only user's id is saved in the session, and user's
// id is later used to retrieve the whole object via deserializeUser function.
passport.serializeUser(function(user, done) {
  done(null, user.id);                       
});

passport.deserializeUser(function(id, done) {
  Users
  .findById(id, function(err, user) {
    done(err, user);
  });
});

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


if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
