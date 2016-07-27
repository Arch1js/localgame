var User = require('./models/user');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(app, passport ) {
//get game data route =========================================================
app.post('/games', function(req, res, searchData) {
		var search = req.body.search;
		console.log(req);
		console.log(search);
		// console.log(search);

		var search_key = search.replace(/ /g,"_");

		console.log(search_key);

				var options = {
					host: 'www.igdb.com',
					path: '/api/v1/games/search?q='+search_key,
					// path: '/api/v1/games/4443',
					// path: '/api/v1/games',
					port: '443',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Token token="t8t8KrTTgdle_C-eRJhnT31L67Cnu0X5AywkbcqJkxc"'
					}
				};

				callback = function(response) {

					var str = ''
					response.on('data', function (chunk) {
						str += chunk;
					});

					response.on('end', function () {
						console.log(str);
						res.send(str); // return all todos in JSON format
					});
				}
				var https = require('https');
				var req = https.request(options, callback);
				req.end();
	});

	app.post('/mygames', function(req, res) {

			console.log('getmygames fired');

			var newGame = User();

			// newGame.save(function(err) {
			// 		if (err)
			// 				throw err;
			// });

			var user = req.user._id;
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

//record game id route =========================================================
	app.post('/addgames', function(req, res) {

		var id = req.body.id;
		var title = req.body.name;
		var cover = req.body.cover;

		console.log(id);
		console.log(title);
		console.log(cover);

		// console.log(req);
		var newGame = User();


		// newGame.save(function(err) {
		// 		if (err)
		// 				throw err;
		// });

		var user = req.user._id;

		User.update({_id: ObjectId(user)}, {$addToSet: {games:{id: id, name: title, cover: cover}}}, function(err) {
			if(err)
			console.log("Error");
		});

// User.findOneAndUpdate({_id: ObjectId("5797aababa0873dc1ddbfd73")}, {$addToSet: {"games.id":search}}, function(err) {
// 	if(err)
// 	console.log("Error");
// });

	});

// normal routes ===============================================================

	// main login page
	app.get('/', function(req, res) {
		// res.render('games.ejs', { message: req.flash('loginMessage') });
		res.render('games.ejs', { message: req.flash('loginMessage') }); //for development porposes - doesnt require login on games page
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

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

	app.get('/mygames', isLoggedIn, function(req, res) {
		res.render('mygames.ejs', {
			user : req.user
		});
	});

	// app.get('/mygames', isLoggedIn, function(req, res) { //requires user to be logged in
	// 	res.render('mygames.ejs', {
	// 		message: req.flash('loginMessage')
	// 	});
	// });
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
