angular.module('userService', [])

	// super simple service
	// each function returns a promise object
	.factory('userProfile', function($http) {
		return {
			getuser: function(user) {
				return $http.post('/user', {user: user});
			},
			gameRequest: function(game,cover,user) {
				return $http.post('/sendGameRequest', {game: game,cover: cover, user: user});
			},
			friendRequest: function(user) {
				return $http.post('/sendfriendRequest', {user: user});
			}
		}
	});
