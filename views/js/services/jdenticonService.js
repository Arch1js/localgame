angular.module('jdenticonService', [])
	.factory('jdenticonService', function($http) {
		return {
			geticon: function() {
				return $http.post('/getJdenticon');
			}
		}
	});
