angular.module('userController', [])

	.controller('userCtrl', function($scope, $http, userProfile, jdenticonService) {
		$scope.formData = {};

		function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

		}

		jdenticonService.geticon()
		.success(function(data) {
			$scope.username = data.username;
			jdenticon.update("#identicon", data.avatar);
		});

		$scope.sendGameRequest = function(i) {
			var user = getURLParameter('id');
			var game = i.name;
			var cover = i.cover;

			userProfile.gameRequest(game,cover,user);
		}

		$scope.sendFriendRequest = function() {
			console.log('friend request function started');
			var user = getURLParameter('id');

			userProfile.friendRequest(user);
		}

		$scope.displayGames = function() {
			console.log('Display games function fired!');


			var user = getURLParameter('id');

			userProfile.getuser(user)

			.success(function(data) {
				console.log(data);
				if(data.friend == 'yes') {
					// $('#friend').css('display','none');
					$scope.friend_btn = false;
					$scope.friend_btn_positive = true;
				}
				else {
					$scope.friend_btn = true;
				}
				jdenticon.update("#userIdenticon", data.avatar);

				$scope.games = data.games;
				$scope.user = data.username;

			});
		};

		$scope.displayGames();

	});
