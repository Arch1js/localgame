angular.module('profileService', ['ui.bootstrap'])

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
			getFriendRequests: function() {
				return $http.post('/getfriendrequests')
			},
			getGameRequests: function() {
				return $http.post('/getgamerequests')
			},
			deleteFriendRequest: function(id) {
				return $http.post('/deletefriendrequest', {id: id})
			},
			deleteGameRequest: function(req_id) {
				return $http.post('/deletegamerequest', {id: req_id})
			},
			addFriend: function(friend, username, id) {
				return $http.post('/addFriend', {friend: friend, username: username, id: id})
			},
			getFriends: function() {
				return $http.post('/getFriends')
			},
			sendMessage: function(to, message) {
				return $http.post('/sendMessage', {to: to, message: message})
			},
			getConversations: function() {
				return $http.post('/getConversations')
			},
			getMessages: function(id) {
				return $http.post('/getMessages', {id: id})
			},
			getUsers: function(user) {
				return $http.post('/getUsers', {user: user})
			},
			getSession: function() {
				return $http.post('/getSession')
			},
			getUnreadCount: function() {
				return $http.post('/getUnreadCount')
			},
			getRequestCount: function(request) {
				return $http.post('/getRequests', {type: request})
			}
		}
	});
