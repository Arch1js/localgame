var User = require('./models/user');
var Messages = require('./models/messages');
var Conversation = require('./models/conversation');
var ObjectId = require('mongodb').ObjectID;
var unirest = require('unirest');
var socketio = require('socket.io');
const uuidV1 = require('uuid/v1');
var shortid = require('shortid');
var io;
io = socketio;

module.exports = function(app, passport, io) {

  app.post('/getJdenticon', function(req, res){

  var user = req.user._id;

  User.findOne({_id: ObjectId(user)}, {"avatar":1, "username":1}, function(err, user) {
      res.json(user);
    });
  });

    // POST Routes
    // --------------------------------------------------------
    app.post('/map', function(req, res){
		  var query = User.find({});
			query.exec(function(err, users){
			  if(err)
			    res.send(err);
			    res.json(users);
			});
    });
    app.post('/getSession', function(req, res){
		  res.send(req.user.username);
    });

    	app.post('/saveLocation', function(req, res){
    		var lat = req.body.latitude;
    		var lng = req.body.longitude;
        var user = req.user._id;

        User.findOne({_id: ObjectId(user)}, function(err, user) {

          user.location.lat = lat;
          user.location.lng = lng;

          user.save(function(err) {
            if (err)
              throw err;
            });
          });
        });

    app.post('/userLocation', function(req, res){
      var user = req.user._id;
      User.findOne({_id: ObjectId(user)}, {"avatar":1, "location":1}, function(err, user) {
          res.json(user);
        });
      });

		app.post('/query', function(req, res){
		var lat = req.body.latitude;
		var long = req.body.longitude;
		var distance = req.body.distance;
    var game = req.body.game;
    var user = req.user._id;

    if(!game) {
      var query = User.find({'_id': {$ne: user}}, {"location": 1, "username": 1,"avatar":1});
    }
    else {
      var query = User.find({'_id': {$ne: user}, 'games.name' : game}, {"location": 1, "username": 1,"avatar":1});
    }

		if(distance){
				query = query.where('location').near({ center: {type: 'Point', coordinates: [lat, long]},
						maxDistance: distance * 1609.34, spherical: true});
		}

		query.exec(function(err, users){
				if(err)
						res.send(err);
				else
						res.json(users);
		        });
      });


//Game routes =========================================================
app.post('/games', function(req, res, searchData) {
		var search = req.body.search;
		var search_key = search.replace(/ /g,"_");

		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary,first_release_date&search="+search_key)
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
			res.send(result.body);
		});

	});

	app.post('/getnewest', function(req, res) {
		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary,first_release_date&order=rating_count:desc&limit=30&offset=0")
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
			res.send(result.body);
		});
	});


	app.post('/mygames', function(req, res) {
			var newGame = User();
			var user = req.user._id;

			User.findOne({_id: ObjectId(user)}, function(err,result) {
				if(err) {
					console.log(err);
				}
				else {
					res.send(result);
				}
			});
		});

    app.post('/getfriendrequests', function(req, res) {
        var user = req.user._id;
        var newGame = User();

        User.findOne({_id: ObjectId(user)}, {"friendRequests":1}, function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            res.send(result);
          }
        });
      });

      app.post('/getgamerequests', function(req, res) {
          var user = req.user._id;

          var newGame = User();

          User.findOne({_id: ObjectId(user)}, {"gameRequests":1}, function(err,result) {
            if(err) {
              console.log(err);
            }
            else {
              res.send(result);
            }
          });
        });

    app.post('/user', function(req, res) {
        var user = req.body.user;
        var current_user = req.user._id;
        var newGame = User();

        User.findOne({_id: ObjectId(user)}, {"avatar":1, "games":1, "username":1}, function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            var r = result.toObject();
            User.findOne({_id: ObjectId(current_user), 'friends.user': user}, {"_id":1}, function(err,friend) {
              if(err) {
                console.log(err);
              }
              else if (friend == null) {
                r.friend = 'no';
                res.send(r);
              }
              else {
                r.friend = 'yes';
                res.send(r);
              }
            });
          }
        });
      });

      app.post('/getFriends', function(req, res) {
          var user = req.user._id;
          var newGame = User();
          var resultArray = {};
          var i = 0;
          var userdata = [];
          User.findOne({_id: ObjectId(user)}, {"friends":1}, function(err,result) {
            if(err) {
              console.log(err);
            }
            else {
              if(result.friends.length > 0) {
                for (var i = 0; i < result.friends.length; i++) {
                  User.findOne({_id: ObjectId(result.friends[i].user)}, {"username":1, "avatar": 1}, function(err,result) {
                    userdata.push(result);
                    console.log(result);
                    if(i == userdata.length) {
                      res.send(userdata);
                    }
                  })
                }
              }
              else {
                var empty = {"friends":0};
                res.send(empty);
              }
            }
          });
        });

        app.post('/getUsers', function(req, res) {
            var user = req.user._id;
              // var user = '57bb3a324f8c8a1100f4ca7a';
              var friend = req.body.user;

              var newGame = User();
                User.find({_id: ObjectId(user),'friends.username': new RegExp(friend,'i')}, {"friends.username":1}, function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    return result;
                  }
                });
          });


    app.post('/deletefriendrequest', function(req, res) {
        var user = req.user._id;
        var reqId = req.body.id;
        var newGame = User();

        User.update({_id: ObjectId(user)}, {$pull: {"friendRequests" : {id: reqId}}}, function(err) {
          if(err)
            console.log(err);
          });
        });

      app.post('/deletegamerequest', function(req, res) {
          var id = req.body.id;
          var user = req.user._id;
          var newGame = User();

          User.update({_id: ObjectId(user)}, {$pull: {"gameRequests" : {id: id}}}, function(err) {
            if(err)
              console.log(err);
            });
          });

      app.post('/addFriend', function(req, res) {
          var friend = req.body.friend;
          var username = req.body.username;
          var user = req._passport.session.user;
          var reqId = req.body.id;
          var user_username = req.user.username;
          var newGame = User();

          User.update({_id: ObjectId(user),'friends.user': {$ne: friend}}, {$push: {friends:{user: friend, username: username}}}, function(err) {
            if(err)
            console.log(err);
          });

          User.update({_id: ObjectId(friend),'friends.user': {$ne: user}}, {$push: {friends:{user: user, username: user_username}}}, function(err) {
            if(err)
            console.log(err);
          });

          User.update({_id: ObjectId(user)}, {$pull: {"friendRequests" : {id: reqId}}}, function(err) {
            if(err)
            console.log(err);
          });
        });

      app.post('/sendGameRequest', function(req, res) {
          var game = req.body.game;
          var cover = req.body.cover;
          var receiveUser = req.body.user;
          var requestUser = req.user._id;
          var username = req.user.username;

          var min = 1;
          var max = 10000000;
          var random_id = Math.floor(Math.random() * (max - min)) + min;

          var date_time = new Date();

          var newGame = User();

          User.update({_id: ObjectId(receiveUser),'gameRequests.game': {$ne: game}}, {$push: {gameRequests:{id: random_id, user: requestUser, username: username, time: date_time, game: game, cover: cover}}}, function(err) {
            if(err)
            console.log(err);
          });

        });

        app.post('/sendfriendRequest', function(req, res) {
            var receiveUser = req.body.user;
            var requestUser = req.user._id;
            var reqestUsername = req.user.username;
            var avatar = req.user.avatar;

            var min = 1;
            var max = 10000000;
            var random_id = Math.floor(Math.random() * (max - min)) + min;

            // var date_time = new Date();
            var newGame = User();

            User.update({_id: ObjectId(receiveUser),'friendRequests.user': {$ne: requestUser}}, {$push: {friendRequests:{id: random_id, user: requestUser, username: reqestUsername, avatar: avatar}}}, function(err) {
              if(err)
              console.log(err);
            });
          });

	      app.post('/addgames', function(req, res) {
        		var id = req.body.id;
        		var title = req.body.name;
        		var cover = req.body.cover;
            var platform = req.body.platform;
        		var newGame = User();
        		var user = req.user._id;

        		User.update({_id: ObjectId(user)}, {$addToSet: {games:{id: id, name: title, cover: cover, platform: platform}}}, function(err) {
        			if(err)
        			console.log(err);
        		});
	        });

      app.post('/sendMessage', function(req, res) {
        console.log("Message is sending");
        var to = req.body.to;
        var from_usr = req.user.username;
        var message = req.body.message;

        var uuid = uuidV1();

        var newConvo = new Conversation();

        newConvo.id = uuid;
        newConvo.roomID = shortid.generate();
        newConvo.status = 'unseen';
        newConvo.participants = [from_usr,to]
        newConvo.save(function(err) {
          if(err)
          console.log(err);
        })

        var newMsg = new Messages();

        newMsg.conversationID = uuid;
        newMsg.to = to;
        newMsg.from = from_usr;
        newMsg.msg = message;
        newMsg.save(function(err) {
          if(err)
          console.log(err);
          else {
            res.send(res.statusCode);
          }
        });
      });
      app.post('/getUnreadCount', function(req, res) {
        var user = req.user.username;
        Conversation.count({ $or: [{participants: {$in:[user]}}], status: "unseen"}, function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            var unreadCount = {"count":result};
            res.send(unreadCount);
          }
        })
      });

      app.post('/getMessages', function(req, res) {
        var convoID = req.body.id;

        var message = Messages.find({conversationID: convoID}, function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            Conversation.update({id: convoID}, {$set: {status: "seen"}}, function(err) {
              if(err) {
                console.log(err);
              }
            });
          }
        });
        message.sort('created').exec(function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            res.send(result);
          }
        })
      });

      app.post('/getConversations', function(req, res) {
        var user = req.user.username;
        var newMsg = Messages();

        Conversation.find({ $or: [{participants: {$in:[user]}}]}, function(err,result) {
          if(err)
          console.log(err);
          else if(result) {
            res.send(result);
          }
        })
      });

      app.post('/getRequests', function(req, res) {
        var user = req.user._id;

        if(req.body.type == "game") {
          User.aggregate([{$match:{_id: ObjectId(user)}},{$unwind: "$gameRequests"}, {$group: {_id:null, count: {$sum: 1}}}],function(err,result) {
            if(err)
            console.log(err);
            else if(result) {
              res.send(result);
            }
          })
        }
        if(req.body.type == "friends") {
          User.aggregate([{$match:{_id: ObjectId(user)}},{$unwind: "$friendRequests"}, {$group: {_id:null, count: {$sum: 1}}}],function(err,result) {
            if(err)
            console.log(err);
            else if(result) {
              res.send(result);
            }
          })
        }

      });

		app.post('/removegame', function(req, res) {
			var id = req.body.id;
			var user = req.user._id;

			User.update({_id: ObjectId(user)}, {$pull: {"games" : {id: id}}}, function(err) {
				if(err)
				console.log(err);
				else {
					res.send();
				}
			});
		});


// normal routes ===============================================================


	// main login page
	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
	});

	app.get('/map',isLoggedIn, function(req, res) {
		res.render('map.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
	});

  app.get('/chat',isLoggedIn, function(req, res) {
    res.render('chat.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
  });

	// PROFILE SECTION =========================
	app.get('/profile',isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

  app.get('/user',isLoggedIn, function(req, res) {
		res.render('user.ejs', {
      user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	app.get('/games',isLoggedIn, function(req, res) {
		res.render('games.ejs', {
			user : req.user
		});
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile#/mygames', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', { //disable for now
			successRedirect : '/profile#/mygames', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile#/mygames',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile#/mygames',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile#/mygames',
				failureRedirect : '/'
			}));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
