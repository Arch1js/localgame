// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var conversationSchema = mongoose.Schema({
  id: String,
  roomID: String,
  participants: Array,
  status: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Conversation', conversationSchema);
// var Conversation =  mongoose.model('Conversation', conversationSchema);
