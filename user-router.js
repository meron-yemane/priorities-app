const {BasicStrategy} = require('passport-http');
const LocalStrategy   = require('passport-local');
const express = require('express');
const morgan = require('morgan');
const jsonParser = require('body-parser').json();
const passport = require('passport');
const mongoose = require('mongoose');

const {Users} = require('./models');

const userRouter = express.Router();

var session = require('express-session');//creates a session middleware
var MongoDBStore = require('connect-mongodb-session')(session);

userRouter.use(jsonParser);


// NB: at time of writing, passport uses callbacks, not promises
const basicStrategy = new BasicStrategy({
  passReqToCallback: true
  },
  function(username, password, callback){
  let user;
  Users
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});


const localStrategy = new LocalStrategy({
  session: true
  },
  function(username, password, done) {
    console.log("inside")
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
            return done(null, false, {message: 'Oops! Wrong password.'}); 
          }
          return done(null, user);
        })
    });
  });

passport.use(localStrategy);
passport.use(basicStrategy);

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

userRouter.use(passport.initialize());

userRouter.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }
    // check for existing user
  return Users
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      return Users.hashPassword(password)
    })
    .then(hash => {
      return Users
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
});

userRouter.post('/login', passport.authenticate('local', {
        failureRedirect : '/login', 
        failureFlash : true 
    }), function(req, res) {
    return res.status(200).send({})
  });

userRouter.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
});

userRouter.get('/me',
  passport.authenticate('local', {session: true}),
  (req, res) => res.json({user: req.user.apiRepr()})
);


module.exports = {userRouter};
