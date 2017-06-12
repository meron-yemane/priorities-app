const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PrioritySchema = new Schema({
  id: {type: Number,required: true}, 
  goal: {type: String, required: true}, 
  completed: {type: Boolean, required: true},
  date_committed: {type: Date, required: true}
});

const Priorities = mongoose.model('Priorities', PrioritySchema);

module.exports = Priorities