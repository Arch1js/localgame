var profileCtrl = angular.module('profileCtrl', [])

	// inject the Todo service factory into our controller
	profileCtrl.controller('profileCtrl', function($scope, $http, profile, jdenticonService) {

		$scope.loading = true;

		$scope.hometab = 'active'; //set navbar home tab active

		jdenticonService.geticon()
		.success(function(data) {
			$scope.username = data.username;
			jdenticon.update("#identicon", data.avatar);
		});

		$scope.askToSendConfirm = function() {
      BootstrapDialog.show({
          title: 'localGame',
            message: 'Can we send message to user confirming your decision? (Currently not working)',
            buttons: [{
                label: 'Yes',
                cssClass: 'btn-success',
                action: function(dialog) {
                	console.log('Message sent!');
									dialog.close();
                }
            }, {
                label: 'No',
                cssClass: 'btn-warning',
                action: function(dialog) {
                  dialog.close();
                }
            }]
        });
    }
		$scope.acceptGameRequest = function(i) {
			$scope.askToSendConfirm();
		}

		$scope.declineRequest = function(i) {
			var req_id = i.id;
			profile.deleteGameRequest(req_id);
			$scope.getGameRequests();
		}

		$scope.getFriendRequests = function() {
			$scope.requests = false;
			$scope.friendrequests = {};
			profile.getFriendRequests()

			.success(function(friendrequests) {
				console.log(friendrequests);
				if(friendrequests.friendRequests.length == 0) {
					console.log('no requests');
					$scope.loading = false;
					$scope.request_error = true;
				}
				else {
					console.log('have requests');
					$scope.friendrequests = friendrequests.friendRequests;
					$scope.user_requests = true;
					$scope.loading = false;
				}

			});
		};

		$scope.getGameRequests = function() {
			$scope.requests = false;
			$scope.game_requests = {};
			profile.getGameRequests()

			.success(function(requests) {
				console.log(requests);
				if(requests.gameRequests.length == 0) {
					console.log('no requests');
					$scope.loading = false;
					$scope.gamerequest_error = true;
				}
				else {
					console.log('have requests');
					$scope.gamerequests = requests.gameRequests;
					$scope.game_requests = true;
					$scope.loading = false;
				}

			});
		};

		$scope.getFriends = function() {
			console.log('friends open');
			$scope.friends = false;
			$scope.friends = {};
			profile.getFriends()

			.success(function(friends) {
				console.log(friends);

				if(friends.friends.length == 0) {
					$scope.friend_error = true;
					$scope.friends = true;
				}
				else {
					$scope.friends = friends.friends;
					$scope.user_friends = true;
					$scope.loading = false;
				}
			});
		};

		$scope.addFriend = function(i) {
			var friend = i.user;
			var username = i.username;
			var id = i.id;

			profile.addFriend(friend, username, id);

			profile.deleteFriendRequest(id);

			$scope.getFriendRequests();
		};

		$scope.deleteFriendRequest = function(i) {
			var id = i.id;
			profile.deleteFriendRequest(id);
			$scope.getFriendRequests();
		}

		$scope.displayGames = function() {

			console.log('Display games function fired!');

			profile.getmygames()

			.success(function(user) {
          console.log(user);
          jdenticon.update("#userIdenticon", user.avatar);

					if(user.games.length == 0) {
						$scope.games = {};
						$scope.loading = false;
						$scope.mygames = true;
						$scope.games_error = true;
					}
					else {
						$scope.games = user.games;
	          $scope.username = user.username;
						$scope.games_error = false;
						$scope.loading = false;
						$scope.mygames = true;
					}
			});
		};

		// $scope.displayGames();

		$scope.removeGame = function(i) {
			var id = i.id;
			console.log(id);
			console.log('Remove game function fired!');

			toastr.options = {
				"positionClass": "toast-bottom-left",
			};
			var removeMessage = 'Game removed from your collection!';
			toastr.warning(removeMessage);

			profile.removegame(id)
			.success(function() {
				console.log('Success!');
				$scope.displayGames();
			});
		}


	});
