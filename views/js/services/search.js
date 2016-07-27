angular.module('searchService', [])

	// super simple service
	// each function returns a promise object
	.factory('Games', function($http) {
		return {
			searchGames : function(search) {
				console.log('Search factory fired');
				console.log(search);
				return $http.post('/games', {search: search});
			},
			getmygames: function() {
				return $http.post('/mygames');
			},
			// getNewest : function() {
			// 	return $http.post('/games');
			// },

		}
	});
