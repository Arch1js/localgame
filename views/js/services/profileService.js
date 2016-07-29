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
			}
		}
	});
