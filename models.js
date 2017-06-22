const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PrioritySchema = new Schema({ 
  goal: {type: String, required: true}, 
  completed: {type: Boolean, required: true},
  date_committed: {type: Date, default: Date.now}, //look at how to include date
  username: {type: String, required: true}
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""}
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const Users = mongoose.model('Users', UserSchema);

const Priorities = mongoose.model('Priorities', PrioritySchema);

module.exports = {Priorities, Users}