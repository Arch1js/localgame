angular.module('searchController', [])

	// inject the Todo service factory into our controller
	.controller('gameController', function($scope, $http, Games, addGame) {
		$scope.formData = {};

		// var search = $scope.formData;

		// Games.getNewest()
		//
		// 	.success(function(data) {
		// 		$scope.formData = {}; // clear the form so that new query can be entered
		// 		$scope.games = data; // update scope with new games
		// 	});

		$scope.searchGame = function() {
			var search = $scope.search;
				Games.searchGames(search)

					.success(function(data) {

						// $scope.formData = {}; // clear the form so that new query can be entered
						$scope.games = data; // update scope with new games
					});
		};

		// $scope.searchGame();

		$scope.displayGames = function() {
			console.log('Display games function fired!');

			Games.getmygames()

			.success(function(data) {
					$scope.games = data;
			});
		};

		// $scope.displayGames();

		$scope.addGame = function(i) {

			$scope.gameID = i.id;
			$scope.name = i.name;
			$scope.cover = i.cover_id;

			console.log('addGame function fired');

			var id = i.id;
			var name = i.name;
			var cover = i.cover_id;

			addGame.create(id, name, cover)

				.success(function(data) {


				});

			$('.circle').on("click", ".fa", function() { //change fa-plus to fa-check when clicked

					var wasPlus = $(this).hasClass('fa-plus');
					$(this).removeClass('fa-plus fa-check');
					var change = wasPlus ? 'fa-check' : 'fa-plus';
					$(this).addClass(change);

				});

		};

	});
