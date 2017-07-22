const express = require('express');
const jsonParser = require('body-parser').json();
const moment = require('moment');
const {Priorities} = require('./models');
const {Users} = require('./models');

const prioritiesRouter = express.Router();

prioritiesRouter.use(jsonParser);


// Check if user is authenticated
function isAuthenticated(req, res, next) {
  console.log(req.user)
    if (req.user) {
        return next();
    }
    console.log("NOT AUTH");
    return res.status(401).send({});
}

prioritiesRouter.get('/all', isAuthenticated, (req, res) => {
  console.log(req.user.id); 
  Users
    .findById(req.user.id)
    .populate('_priorities')
    .exec((err, user) => {
      if (err) {
        console.log("No priorities?!");
      }
      console.log("user prior: " + user._priorities)
      return res.status(200).json(user._priorities);
    });
});

prioritiesRouter.post('/create', isAuthenticated, (req, res) => {
  console.log("req.user: " + req.user)
  console.log("hello thereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  const requiredFields = ['goal', 'completed'];
  for (var i=0; i<requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Priorities.create({goal: req.body.goal, completed: req.body.completed}, (err, priority) => {
    console.log("priority: " + priority)
    if (err) {
      return res.status(400);
    }
    console.log("USERID: " + req)
    Users
      .findById(req.user.id) 
      .exec(function (err, user){
        console.log("USER: " + user);
        if (err) {
          return res.status(400);
        } 
        user._priorities.push(priority);
        user.save(err => {
          if (err) {
            return res.status(400);
          }
          user.populate('Priorities', (err) => {
            if (err) {
              return res.status(400);
            }
          })
          res.status(201).json(priority);
        }) 
      })
  });
});

prioritiesRouter.delete('/:id', isAuthenticated, (req, res) => {
  Priorities
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(priority => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

prioritiesRouter.get('/today', isAuthenticated, (req, res) => { 
  Users
    .findById(req.user.id)
    .populate('_priorities')
    .exec((err, user) => {
      if (err) {
        res.status(500);
      }
    }).then(function(user) {
    if (user._priorities.length === 0) {
      //console.log("USER PRIO: " + user._priorities)
      return res.status(204).json({});
    };
    if (user._priorities[user._priorities.length - 1].date_committed === moment().format("MMM Do YYYY")) {
      return res.status(200).json(user._priorities[user._priorities.length - 1]);
    };
    return res.status(204).json({});
  })
});

prioritiesRouter.put('/:id', isAuthenticated, (req, res) => {
  if(!(req.params.id === req.body._id)) {
    const message = ('Request path id must match request body id');
    res.status(400).json({message: 'Request path id must match request body id'});
  };
  Priorities
    .findByIdAndUpdate({_id: req.params.id}, {$set: {goal: req.body.goal}}, function(err, priority) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(priority);
    });
});

prioritiesRouter.put('/completed/:id', isAuthenticated, (req, res) => {
  // if(!(req.params.id === req.body._id)) {
  //   const message = ('Request path id must match request body id');
  //   res.status(400).json({message: 'Request path id must match request body id'});
  // };
  Priorities 
    .findByIdAndUpdate({_id: req.params.id}, {$set: {completed: true}}, function(err, priority) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(priority);
    });
});



module.exports = {prioritiesRouter};
