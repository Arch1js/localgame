var User = require('./models/user');
var Messages = require('./models/messages');
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
  console.log('New user connected');
  console.log("User session: " + socket.id);

  setNicknames(socket);
  joinRoom(socket);
  handleClientDisconnections(socket);
  privateMessaging(socket);
  newMessage(socket);
  });
}


  function setNicknames(socket){
    socket.on('set nickname', function(nick) {
      console.log("Nickname should be here - " + nick);
  if (namesUsed.indexOf(nick) !== -1) {
    console.log('That name is already taken!  Please choose another one.');
    return;
  }
  var ind = namesUsed.push(nick) - 1;
  clients[nick] = socket.id;
  nicknames[socket.id] = nick;
  console.log(nicknames);
});
}


  function newMessage(socket){
    socket.on('new message', function(data) {
      console.log("New message route activated- " + data);
      chat.to(client).emit('new message', from);
  });
  }


function handleClientDisconnections(socket){
  socket.on('disconnect', function(){
    console.log("User has Disconnected");
    var ind = namesUsed.indexOf(nicknames[socket.id]);
    delete namesUsed[ind];
    delete clients[ind];
    delete nicknames[socket.id];
  });
}


  function joinRoom(socket){
    socket.on('join room', function(data) {
      console.log("Joined room - " + data.room);
      socket.join(data.room);
    })
  }

  function privateMessaging(socket) {
    socket.on('chat message', function(data){
      var conversationID = data.convoID;
      var to = data.toUser;
      var from = nicknames[socket.id];
      var msg = data.msg;
      console.log("Conversation id - " + conversationID);
      console.log("To User - " + to);
      console.log("From user - " + from);
      console.log("Message - " + msg);
      var client = clients[data.toUser];

      var saveMsg = new Messages();

      saveMsg.conversationID = conversationID;
      saveMsg.to = to;
      saveMsg.from = from;
      saveMsg.msg = msg;
      saveMsg.save(function(err){
        if(err) throw err;
        socket.broadcast.to(data.room).emit('chat message', data.msg, from);
      });
      chat.to(client).emit('new message', from);

        // chat.to(client).emit('chat message', data.msg, from);

        // chat.emit('chat message', data.msg);
      });
  }
