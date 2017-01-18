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
      // console.log(user);
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
		var lat             = req.body.latitude;
		var long            = req.body.longitude;
		var distance        = req.body.distance;
    var user            = req.user._id;

		var query = User.find({'_id': {$ne: user}}, {"location": 1, "username": 1});

		if(distance){
				query = query.where('location').near({ center: {type: 'Point', coordinates: [lat, long]},
						maxDistance: distance * 1609.34, spherical: true});
		}

		query.exec(function(err, users){
				if(err)
						res.send(err);
				else
						console.log(users);
						res.json(users);
		        });
      });


//Game routes =========================================================
app.post('/games', function(req, res, searchData) {
		var search = req.body.search;
		var search_key = search.replace(/ /g,"_");//replace any spaces in search variable

		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover&search="+search_key)
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
      console.log(result.status, result.headers, result.body);
			res.send(result.body);
		});

	});

	app.post('/getnewest', function(req, res) {

		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=cover,name&limit=30&offset=130")
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
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
            console.log(result);
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
              console.log(result);
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
                console.log('null');
                r.friend = 'no';
                res.send(r);
              }
              else {
                console.log('success');
                r.friend = 'yes';
                console.log(r);
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

          User.findOne({_id: ObjectId(user)}, {"friends":1}, function(err,result) {
            if(err) {
              console.log(err);
            }
            else {
              console.log(result);
              res.send(result);
            }
          });
        });

        app.post('/getUsers', function(req, res) {
          console.log('getUsers fired');
            // var user = req.user._id;

              var user = '57bb3a324f8c8a1100f4ca7a';
              var friend = req.body.user;
              console.log(friend);
              var newGame = User();
                User.find({_id: ObjectId(user),'friends.username': new RegExp(friend,'i')}, {"friends.username":1}, function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                  else {
                    console.log(result);
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
            console.log("Error");
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
              console.log("Error");
            });
          });

	      app.post('/addgames', function(req, res) {
        		var id = req.body.id;
        		var title = req.body.name;
        		var cover = req.body.cover;
        		var newGame = User();
        		var user = req.user._id;

        		User.update({_id: ObjectId(user)}, {$addToSet: {games:{id: id, name: title, cover: cover}}}, function(err) {
        			if(err)
        			console.log("Error");
        		});
	        });

      app.post('/sendMessage', function(req, res) {
        console.log('Mesage route activated');
        var to = req.body.to;
        var from_usr = req.user.username;
        var message = req.body.message;

        var uuid = uuidV1();


        var newConvo = new Conversation();

        newConvo.id = uuid;
        newConvo.roomID = shortid.generate();
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

      app.post('/getMessages', function(req, res) {
        var convoID = req.body.id;
        console.log("Routes received id: " + convoID);

        var message = Messages.find({conversationID: convoID}, function(err,result) {
          // if(err) {
          //   console.log(err);
          // }
          // else {
          //   res.send(result);
          // }
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
        // Messages.find({ $or: [{from: user}]}, function(err,result) {
        //   if(err) {
        //     console.log(err);
        //   }
        //   else {
        //     console.log(result);
        //     res.send(result);
        //   }
        // });
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
		// res.render('games.ejs', { message: req.flash('loginMessage') });
		res.render('login.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
	});

	app.get('/map', function(req, res) {
		// res.render('games.ejs', { message: req.flash('loginMessage') });
		res.render('map.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
	});

  app.get('/chat', function(req, res) {
    // res.render('games.ejs', { message: req.flash('loginMessage') });
    res.render('chat.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
  });

	// PROFILE SECTION =========================
	app.get('/profile', function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

  // app.get('/profile', isLoggedIn, function(req, res) {
  //   res.render('profile.ejs', {
  //     user : req.user
  //   });
  // });

  app.get('/getSession', function(req, res) {
    console.log(req.session.user);
    res.send('awesome');
  });

  app.get('/user', function(req, res) {
		res.render('user.ejs', {
      user : req.user
		});
	});

	// app.get('/profile', function(req, res) { //for development to not reqire a user
	// 	res.render('profile.ejs', {
	// 		user : req.user
	// 	});
	// });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	app.get('/games', function(req, res) {
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

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
