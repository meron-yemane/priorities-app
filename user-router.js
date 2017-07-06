const {BasicStrategy} = require('passport-http');
const LocalStrategy   = require('passport-local').Strategy;
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');

const {Users} = require('./models');

const userRouter = express.Router();

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
  session: true,
  passReqToCallback: true
  },
  function(req, username, password, done) {
    Users.count({}, function( err, count){
      console.log( "Number of users:", count );
    })
    Users
    .findOne({username: username}, function (err, user) {
      if (err) { 
        return done("err"); 
      }
      if (!user) { 
        return done(null, false, {message: 'No user found.'})
      }
      if (!user.validatePassword(password)) { 
        return done(null, false, {message: 'Oops! Wrong password.'}) 
      }
      return done(null, user);
    });
  });

passport.use(localStrategy);
passport.use(basicStrategy);
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
    res.status(200).send({})
  });

//userRouter.post('/login', (req, res) => {
  //  Users
    //.find({username: req.body.username, password: req.body.password})
    //.then(user => {
      //console.log('USER LOG' + ' = ' + user)     
      //res.json({user: req.user.apiRepr()})
    //})
    //.catch(err => {
      //console.log(err)
    //});

      //console.log(user)
      //if (err) {
        //console.log(err)
      //} else {
        //console.log("USER LOG = " + user.username)
        //res.json({user: req.user.apiRepr()})
      //}
//});

userRouter.get('/me',
  passport.authenticate('local', {session: true}),
  (req, res) => res.json({user: req.user.apiRepr()})
);


module.exports = {userRouter};

//('/login', passport.authenticate('basic', {
  //  successRedirect: '/',
    //failureRedirect: '/login',
    //failureFlash: true,
    //session: true 
  //}),
