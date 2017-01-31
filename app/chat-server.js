var User = require('./models/user');
var Messages = require('./models/messages');
var Conversation = require('./models/conversation');
var ObjectId = require('mongodb').ObjectID;
var socketio = require('socket.io');
var io;
var chat;

// maps socket.id to user's nickname
var nicknames = {};
// list of socket ids
var clients = {};
var namesUsed = [];

module.exports = function(app,passport,io) {
  chat = io.on('connection', function(socket){
  setNicknames(socket);
  joinRoom(socket);
  handleClientDisconnections(socket);
  privateMessaging(socket);
  newMessage(socket);
  });
}


  function setNicknames(socket){
    socket.on('set nickname', function(nick) {
  if (namesUsed.indexOf(nick) !== -1) {
    return;
  }
  var ind = namesUsed.push(nick) - 1;
  clients[nick] = socket.id;
  nicknames[socket.id] = nick;
});
}


  function newMessage(socket){
    socket.on('new message', function(data) {
      chat.to(client).emit('new message', from);
  });
  }


function handleClientDisconnections(socket){
  socket.on('disconnect', function(){
    var ind = namesUsed.indexOf(nicknames[socket.id]);
    delete namesUsed[ind];
    delete clients[ind];
    delete nicknames[socket.id];
  });
}


  function joinRoom(socket){
    socket.on('join room', function(data) {
      socket.join(data.room);
    })
  }

  function privateMessaging(socket) {
    socket.on('chat message', function(data){
      var conversationID = data.convoID;
      var to = data.toUser;
      var from = nicknames[socket.id];
      var msg = data.msg;
      var client = clients[data.toUser];

      var saveMsg = new Messages();

      saveMsg.conversationID = conversationID;
      saveMsg.to = to;
      saveMsg.from = from;
      saveMsg.msg = msg;
      saveMsg.save(function(err){
        if(err) throw err;
        Conversation.update({id: conversationID}, {$set: {status: "unseen"}}, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Updated status successfully!");
          }
        });
        var date = new Date();
        var dateNow = date.getDate();
        var month = date.getMonth() +1;
        var year = date.getFullYear();
        var time = date.toLocaleTimeString();
        var date_time = time + " " + dateNow+"/"+month+"/"+year;
        socket.broadcast.to(data.room).emit('chat message', data.msg, from, date_time);
      });
      chat.to(client).emit('new message', from);

        // chat.to(client).emit('chat message', data.msg, from);

        // chat.emit('chat message', data.msg);
      });
  }
