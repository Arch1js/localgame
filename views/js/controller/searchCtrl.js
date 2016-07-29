angular.module('searchController', [])

	// inject the Todo service factory into our controller
	.controller('searchGamesCtrl', function($scope, $http, Games) {

		$scope.formData = {};

		$scope.getNewestGames = function() {
			console.log('Fetching newest games..');

			Games.getNewest()

			.success(function(data) {

				$scope.games = data;
			});
		}
		$scope.getNewestGames();

		$scope.searchGame = function() {
			var search = $scope.search;
				Games.searchGames(search)

					.success(function(data) {

						$scope.formData = {}; // clear the form so that new query can be entered
						$scope.games = data; // update scope with new games
					});
		};

		// $scope.searchGame();

		$scope.addGame = function(i) {

			// $scope.gameID = i.id; //for testing purpose to see id on screen
			// $scope.name = i.name;
			// $scope.cover = i.cover.cloudinary_id;

			console.log('addGame function fired');

			var id = i.id;
			var name = i.name;
			var cover = i.cover.cloudinary_id;

			Games.create(id, name, cover)

				.success(function(data) {


				});

			// $('.circle').on("click", ".fa", function() { //change fa-plus to fa-check when clicked
			//
			// 		var wasPlus = $(this).hasClass('fa-plus');
			// 		$(this).removeClass('fa-plus fa-check');
			// 		var change = wasPlus ? 'fa-check' : 'fa-plus';
			// 		$(this).addClass(change);
			//
			// 	});

		};


	});
