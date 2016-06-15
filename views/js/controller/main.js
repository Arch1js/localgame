angular.module('searchController', [])

	// inject the Todo service factory into our controller
	.controller('gameController', function($scope, $http, Games) {
		$scope.formData = {};

		var search = $scope.formData;

		Games.getNewest()

			.success(function(data) {
				$scope.formData = {}; // clear the form so that new query can be entered
				$scope.games = data; // update scope with new games
			});

		$scope.searchGame = function() {

				var search = $scope.formData;

				Games.searchGames(search)

					.success(function(data) {
						$scope.formData = {}; // clear the form so that new query can be entered
						$scope.games = data; // update scope with new games
					});
		};

	});
