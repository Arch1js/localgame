angular.module('searchController', [])

	// inject the Todo service factory into our controller
	.controller('searchGamesCtrl', function($scope, $http, Games, jdenticonService) {
		$scope.loading = true;

		$scope.gametab = 'active'; //set navbar games tab active

		jdenticonService.geticon()
		.success(function(data) {
			$scope.username = data.username;
			jdenticon.update("#identicon", data.avatar);
		});

		$scope.formData = {};

		$scope.imgError = function() {
			console.log("Img error!!");
		};
		$scope.getNewestGames = function() {
			console.log('Fetching newest games..');

			Games.getNewest()

			.success(function(data) {
				$scope.loading = false;
				$scope.games = data;
			});
		}
		$scope.getNewestGames();

		$scope.searchGame = function() {
			$scope.error = false;
			$scope.games = false;
			$scope.loading = true;

			var search = $scope.search;
				Games.searchGames(search)

					.success(function(data) {
						if(data.length == 0) {
							$scope.error = true;
						}
						$scope.formData = {}; // clear the form so that new query can be entered
						$scope.games = data; // update scope with new games
						$scope.loading = false;
					});

			$scope.games = true;
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
		};
	})
	.directive('errSrc', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind('error', function() {
				if (attrs.src != attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});

			attrs.$observe('ngSrc', function(value) {
				if (!value && attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
		}
	}
});
