// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var messageSchema = mongoose.Schema({
  to: String,
  from: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Messages', messageSchema);
