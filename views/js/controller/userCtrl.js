angular.module('userController', [])

	.controller('userCtrl', function($scope, $http, userProfile, jdenticonService) {
		$scope.formData = {};

		jdenticonService.geticon()
		.success(function(data) {

			jdenticon.update("#identicon", data.avatar);
		})

		$scope.displayGames = function() {
			console.log('Display games function fired!');

			function getURLParameter(name) {
  			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

			}
			var user = getURLParameter('id');

			userProfile.getuser(user)

			.success(function(data) {
				console.log(data);
				jdenticon.update("#userIdenticon", data.avatar);
				$scope.games = data.games;
				$scope.user = data.username;

			});
		};

		$scope.displayGames();

	});
