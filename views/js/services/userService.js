angular.module('userService', [])

	// super simple service
	// each function returns a promise object
	.factory('userProfile', function($http) {
		return {
			getuser: function(user) {
				return $http.post('/user', {user: user});
			}
		}
	});
