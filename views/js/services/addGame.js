angular.module('addGameService', [])

	// super simple service
	// each function returns a promise object
	.factory('addGame', function($http) {
		return {
			create : function(id, name, cover) {
				console.log(id);
				console.log(name);
				console.log(cover);
				// return $http.post('/addgames');
				return $http.post('/addgames',{id: id, name: name, cover: cover});
			},
			getNewest : function() {
				return $http.post('/games');
			},
			delete : function(id) {
				return $http.delete('/games' + id);
			}
		}
	});
