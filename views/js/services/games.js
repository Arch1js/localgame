angular.module('searchService', [])

	// super simple service
	// each function returns a promise object
	.factory('Games', function($http) {
		return {
			searchGames : function(searchData) {
				return $http.post('/games', searchData);
			},
			getNewest : function() {
				return $http.post('/games');
			},
			delete : function(id) {
				return $http.delete('/games' + id);
			}
		}
	});
