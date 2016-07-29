angular.module('searchService', [])

	// super simple service
	// each function returns a promise object
	.factory('Games', function($http) {
		return {
			getNewest : function() {
				return $http.post('/getnewest');
			},
			searchGames : function(search) {
				console.log('Search factory fired');
				console.log(search);
				return $http.post('/games', {search: search});
			},
			create : function(id, name, cover) {
				console.log(id);
				console.log(name);
				console.log(cover);

				return $http.post('/addgames',{id: id, name: name, cover: cover});
			}

		}
	});
