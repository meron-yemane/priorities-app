const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PrioritySchema = new Schema({ 
  goal: {type: String, required: true}, 
  completed: {type: Boolean, required: true},
  date_committed: {type: Date, required: true} //look at how to include date
});

const Priorities = mongoose.model('Priorities', PrioritySchema);

module.exports = Priorities