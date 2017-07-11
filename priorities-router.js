const express = require('express');
const jsonParser = require('body-parser').json();
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


  // Priorities
  //   .find()
  //   .exec()
  //   .then(priorities => {
  //     res.json(priorities.map((priorities) => priorities));
  //   })
  //   .catch(
  //     err => {
  //       console.error(err);
  //       res.status(500).json({message: 'Internal server error'});
  //     });
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
//     .then(
//       priority => {
//         Users
//           console.log("req.user:" + req.user)
//           .findById(req.params.id) 
//           .exec(function (err, user){
//             if (err) {
//               console.log(err)
//             } else {
//               user._priorities.push(priority);
//               user.save 
//             }
//         })
//       })
//     .then(
//       priority => res.status(201).json(priority))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({message: 'Internal server error'});
//     });
// });

prioritiesRouter.delete('/:id', (req, res) => {
  Priorities
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(priority => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

prioritiesRouter.put('/:id', (req, res) => {
  if(!(req.params._id === req.body._id)) {
    const message = ('Request path id must match request body id');
    console.error(message);
    res.status(400).json({message: 'Request path id must match request body id'});
  };

  const toUpdate = {};
  const updateableFields = ['goal', 'completed'];
  updateableFields.forEach(field => {
    toUpdate[field] = req.body[field];
  });
  Priorities 
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(post => res.status(204).json(post))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {prioritiesRouter};
