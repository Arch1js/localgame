// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '894368400690915', // your App ID
		'clientSecret' 	: '92daa134f5535967308610ef0add20a7', // your App Secret
		'callbackURL' 	: 'https://localgame.herokuapp.com/auth/facebook/callback'
		// 'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback' //redirecting back to localhost
	},

	'twitterAuth' : {
		'consumerKey' 		: 'yybdpeDG2QTb5yRE9tktbdESr',
		'consumerSecret' 	: 'zqwDypt8PQNfAha78WF7j8N96pfkRU4OQ4c0wpdFAerI3E3vG0',
		'callbackURL' 	: 'https://localgame.herokuapp.com/auth/twitter/callback'
		// 'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '437313610187-v6nd0bptv13kl2c9o60h93p1kl1fangb.apps.googleusercontent.com',
		'clientSecret' 	: 'aC4YOqf8u3dnj1szaKaHfn7R',
		'callbackURL' 	: 'https://localgame.herokuapp.com/auth/google/callback'
		// 'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};
