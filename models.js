const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PrioritySchema = new Schema({ 
  goal: {type: String, required: true}, 
  completed: {type: Boolean, required: true},
  date_committed: {type: Date, default: Date.now}, //look at how to include date
  //_creator : { type: Schema.ObjectId, ref: 'Users'}
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
  lastName: {type: String, default: ""},
  _priorities : [{type: Schema.ObjectId, ref: 'Priorities'}]
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const Users = mongoose.model('Users', UserSchema);

const Priorities = mongoose.model('Priorities', PrioritySchema);

module.exports = {Priorities, Users}