angular.module('profileController', [])

	// inject the Todo service factory into our controller
	.controller('profileCtrl', function($scope, $http, profile, jdenticonService) {

		$scope.hometab = 'active'; //set navbar home tab active

		$scope.formData = {};

		jdenticonService.geticon()
		.success(function(data) {

			jdenticon.update("#identicon", data.avatar);
		})


		$scope.displayGames = function() {
			console.log('Display games function fired!');

			profile.getmygames()

			.success(function(data) {
					$scope.games = data;
			});
		};

		$scope.displayGames();

		$scope.removeGame = function(i) {
			var id = i.id;
			console.log(id);
			console.log('Remove game function fired!');

			profile.removegame(id)
			.success(function() {
				console.log('Success!');
				$scope.displayGames();
			});
		}


	});
