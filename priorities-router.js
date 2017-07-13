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
    return res.status(401).send({});
}

prioritiesRouter.get('/all', isAuthenticated, (req, res) => {
  Priorities.count({}, function( err, count){
      console.log( "Number of priorities:", count );
    })
  console.log(req.user.id); 
  Users
    .findById(req.user.id)
    .populate('_priorities')
    .exec((err, priorities) => {
      if (err) {
        console.log("No priorities?!");
      }
      res.json(priorities._priorities);
    });
});

prioritiesRouter.post('/create', isAuthenticated, (req, res) => {
  console.log("req.user: " + req.user)
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
      return res.status(204).json({});
    };
    if (user._priorities[user._priorities.length - 1].date_committed === moment().format("MMM Do YYYY")) {
      return res.status(200).json(user._priorities[user._priorities.length - 1]);
    };
    return res.status(204).json({});
  })
});

prioritiesRouter.put('/:id', isAuthenticated, (req, res) => {
  if(!(req.params._id === req.body._id)) {
    const message = ('Request path id must match request body id');
    console.error(message);
    res.status(400).json({message: 'Request path id must match request body id'});
  };
  // use the get all route and find the date that matches today's then update. 
  // Priorities.findOneAndUpdate({id:req.params.id}, {goal: req.body.goal},
  //   (err, priority) => {
  //     if(err) {
  //       return res.status(400);
  //     }
  //     res.json(priority);
  //   }
  // );



  var getPriorities = prioritiesRouter.get('/all', isAuthenticated, (req, res) => {
    Priorities.count({}, function( err, count){
      console.log( "Number of priorities:", count );
    })
    console.log(req.user.id); 
    Users
      .findById(req.user.id)
      .populate('_priorities')
      .exec((err, priorities) => {
        if (err) {
          console.log("No priorities?!");
        }
        res.json(priorities._priorities);
      });
  })

  getPriorities.then(function(err, priorities) {
    if (err) {
      return res.status(400);
    }
    if (priorities[-1].date_committed === moment().format("MMM Do YYYY")) {
      res.status(200).json(priorities[-1]);
    };
    res.status(204)
  })
});

module.exports = {prioritiesRouter};
