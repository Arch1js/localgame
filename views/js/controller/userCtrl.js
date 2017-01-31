angular.module('userController', [])

	.controller('userCtrl', function($scope, $http, userProfile) {
		$scope.formData = {};

		function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		}

		$scope.sendGameRequest = function(i) {
			var user = getURLParameter('id');
			var game = i.name;
			var cover = i.cover;

			userProfile.gameRequest(game,cover,user);
		}

		$scope.sendFriendRequest = function() {
			var user = getURLParameter('id');

			userProfile.friendRequest(user);
		}

		$scope.displayGames = function() {
			var user = getURLParameter('id');

			userProfile.getuser(user)

			.success(function(data) {
				if(data.friend == 'yes') {
					$scope.friend_btn = false;
					$scope.friend_btn_positive = true;
				}
				else {
					$scope.friend_btn = true;
				}
				jdenticon.update("#userIdenticon", data.avatar);
				console.log(data);
				if(data.games.length == 0) {
					console.log("no games");
					$scope.games_error = true;
				}
				else {
					$scope.games_error = false;
				}
				$scope.games = data.games;
				$scope.user = data.username;
			});
		};
		$scope.displayGames();
	});
