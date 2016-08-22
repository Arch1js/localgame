angular.module('profileService', [])

	// super simple service
	// each function returns a promise object
	.factory('profile', function($http) {
		return {
			getmygames: function() {
				return $http.post('/mygames');
			},
			removegame: function(id) {
				return $http.post('/removegame', {id: id})
			},
			getRequests: function() {
				return $http.post('/getrequests')
			},
			deleteRequest: function(id) {
				return $http.post('/deleterequest', {id: id})
			},
			addFriend: function(friend, username, id) {
				return $http.post('/addFriend', {friend: friend, username: username, id: id})
			},
			getFriends: function() {
				return $http.post('/getFriends')
			}
		}
	});
