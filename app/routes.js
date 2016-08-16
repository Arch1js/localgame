var User = require('./models/user');
var ObjectId = require('mongodb').ObjectID;
var unirest = require('unirest');

module.exports = function(app, passport ) {

  app.post('/getJdenticon', function(req, res){
    console.log('/jdenticon route activated');

  var user = req.user._id;
  // var user = "57ab6e546327106427a3b999";


  User.findOne({_id: ObjectId(user)}, {"avatar":1}, function(err, user) {
      console.log(user);
      res.json(user);

  });
});

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/map', function(req, res){

			        var query = User.find({});
			        query.exec(function(err, users){
			            if(err)
			                res.send(err);

			            // If no errors are found, it responds with a JSON of all users
									// console.log(users);
			            res.json(users);

			        });

    });

    		app.post('/saveLocation', function(req, res){
          console.log('/saveLocation activated');

    		// Grab all of the query parameters from the body.
    		var lat = req.body.latitude;
    		var lng = req.body.longitude;

    		console.log(lat);
    		console.log(lng);

        var user = req.user._id;
        // var user = "57b1b13e9db132982e43657e";


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
      console.log('/userLocation activated');

    var user = req.user._id;
    // var user = "57b2fb423040a8641ef8f26e";


    User.findOne({_id: ObjectId(user)}, {"avatar":1, "location":1}, function(err, user) {
        console.log(user);
        res.json(user);

    });
});

		app.post('/query', function(req, res){


		// Grab all of the query parameters from the body.
		var lat             = req.body.latitude;
		var long            = req.body.longitude;
		var distance        = req.body.distance;

		console.log(lat);
		console.log(long);
		console.log(distance);

		// Opens a generic Mongoose Query. Depending on the post body we will...
		var query = User.find({}, {"location": 1});

		// ...include filter by Max Distance (converting miles to meters)
		if(distance){

				// Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
				query = query.where('location').near({ center: {type: 'Point', coordinates: [lat, long]},


						// Converting meters to miles. Specifying spherical geometry (for globe)
						maxDistance: distance * 1609.34, spherical: true});

		}

		// Execute Query and Return the Query Results
		query.exec(function(err, users){
				if(err)
						res.send(err);
				else
						// If no errors, respond with a JSON of all users that meet the criteria
						console.log(users);
						res.json(users);
		});
});


//Game routes =========================================================
app.post('/games', function(req, res, searchData) {

		var search = req.body.search;

		console.log(req);
		console.log(search);

		var search_key = search.replace(/ /g,"_");//replace any spaces in search variable

		console.log(search_key);

		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover&search="+search_key)
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
			res.send(result.body);
		});

	});

	app.post('/getnewest', function(req, res) {

		console.log('Getnewest running');

		unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=cover,name")
		.header("X-Mashape-Key", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB")
		.header("Accept", "application/json")
		.end(function (result) {
		  console.log(result.status, result.headers, result.body);
			res.send(result.body);
		});

		});


	app.post('/mygames', function(req, res) {

			var newGame = User();

			// newGame.save(function(err) { //add new empty user
			// 		if (err)
			// 				throw err;
			// });

			var user = req.user._id; //real user
			// var user = "5798fa124df558f0085ae9f7";

			console.log(user);

			User.findOne({_id: ObjectId(user)}, function(err,result) {
				if(err) {
					console.log(err);
				}
				else {
					console.log(result.games);
					res.send(result.games);
				}

			});

		});


    app.post('/user', function(req, res) {

        var user = req.body.user;

        var newGame = User();

        User.findOne({_id: ObjectId(user)}, {"avatar":1, "games":1, "username":1}, function(err,result) {
          if(err) {
            console.log(err);
          }
          else {
            res.send(result);
          }

        });

      });
//record game id route =========================================================
	app.post('/addgames', function(req, res) {

		console.log('Addgames post fired');

		var id = req.body.id;
		var title = req.body.name;
		var cover = req.body.cover;

		console.log(id);
		console.log(title);
		console.log(cover);

		// console.log(req);
		var newGame = User();

		// var user = "5798fa124df558f0085ae9f7";
		var user = req.user._id;

		User.update({_id: ObjectId(user)}, {$addToSet: {games:{id: id, name: title, cover: cover}}}, function(err) {
			if(err)
			console.log("Error");
		});

	});

	//record game id route =========================================================
		app.post('/removegame', function(req, res) {

			var id = req.body.id;


			console.log('Removegame post fired');

			// var user = "5798fa124df558f0085ae9f7";
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

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
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

	app.get('/games', isLoggedIn, function(req, res) {
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
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
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
