'use strict'; 
const {Users} = require('./models');

const express = require('express');
const session = require('express-session');//creates a session middleware
const MongoDBStore = require('connect-mongodb-session')(session);
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const assert = require('assert');
const LocalStrategy  = require('passport-local');
//mongoose.Promise = global.Promise; 

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cookieParser());

const {PORT, DATABASE_URL} = require('./config');
const {userRouter} = require('./user-router');
const {prioritiesRouter} = require('./priorities-router');

const store = new MongoDBStore({
    uri: DATABASE_URL,
    collection: 'priorities-app'
});

store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
});

app.use(require('express-session')({
    secret: 'best ever',
    name: 'cookie-name',
    store: store, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

const localStrategy = new LocalStrategy({
  session: true,
  passReqToCallback: true
  },
  function(req, username, password, done) {
    Users.findOne({username: username}, function (err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) { 
        return done(null, false, {message: 'Incorrect username.'});
      }
      user 
        .validatePassword(password)
        .then(valid => {
          if (!valid) {
            return done(null, false, {message: 'Ooops! Wrong passwword.'}); 
          }
          return done(null, user);
        })
    });
  });

passport.use(localStrategy);
//passport.use(basicStrategy);

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


//response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);

app.use(passport.initialize());//required to initialize passport
app.use(passport.session());//required for persistent login sessions
app.use(flash());

app.use('/users/', userRouter);
app.use('/priorities/', prioritiesRouter);
app.use(express.static('public'));
mongoose.Promise = global.Promise; 

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
