// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var messageSchema = mongoose.Schema({
  conversationID: String,
  to: String,
  from: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Messages', messageSchema);
var Chat =  mongoose.model('Messages', messageSchema);

exports.getOldMsgs = function(limit, cb){
	var query = Chat.find({});
	query.sort('-created').limit(limit).exec(function(err, docs){
		cb(err, docs);
	});
}
exports.saveMsg = function(data, cb){
	var newMsg = new Chat({conversationID: data.convoID, to: data.toUser, from: data.from, msg: data.msg});
	newMsg.save(function(err){
		cb(err);
	});
};
