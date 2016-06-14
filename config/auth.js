// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1610783645902344', // your App ID
		'clientSecret' 	: '9fc07c34614c62d970b37a30bfc0cb78', // your App Secret
		'callbackURL' 	: 'https://guarded-castle-78924.herokuapp.com/auth/facebook/callback'
		// 'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	// 'facebookAuth' : {
	// 	'clientID' 		: '894368400690915', // your App ID
	// 	'clientSecret' 	: '92daa134f5535967308610ef0add20a7', // your App Secret
	// 	// 'callbackURL' 	: 'https://guarded-castle-78924.herokuapp.com/auth/facebook/callback'
	// 	'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	// },

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};
