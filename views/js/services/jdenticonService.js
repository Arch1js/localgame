angular.module('jdenticonService', [])

	// super simple service
	// each function returns a promise object
	.factory('jdenticonService', function($http) {
		return {
			geticon: function() {
				return $http.post('/getJdenticon');
			}
		}
	});
