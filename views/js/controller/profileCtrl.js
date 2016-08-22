var profileCtrl = angular.module('profileCtrl', [])

	// inject the Todo service factory into our controller
	profileCtrl.controller('profileCtrl', function($scope, $http, profile, jdenticonService) {

		$scope.loading = true;

		$scope.hometab = 'active'; //set navbar home tab active

		jdenticonService.geticon()
		.success(function(data) {

			jdenticon.update("#identicon", data.avatar);
		})

		$scope.getRequests = function() {
			console.log('requests open');

			profile.getRequests()

			.success(function(requests) {
				console.log(requests);
					$scope.requests = requests.friendRequests;
					$scope.loading = false;
			});
		};

		$scope.getFriends = function() {
			console.log('friends open');

			profile.getFriends()

			.success(function(friends) {
				console.log(friends);
					$scope.friends = friends.friends;
					$scope.loading = false;
			});
		};

		$scope.addFriend = function(i) {
			var friend = i.user;
			var username = i.username;
			var id = i.id;

			profile.addFriend(friend, username, id);

			profile.deleteRequest(id);

			$scope.getRequests();
		};

		$scope.delete = function(i) {
			var id = i.id;
			profile.deleteRequest(id);
			$scope.getRequests();
		}

		$scope.displayGames = function() {
			console.log('Display games function fired!');

			profile.getmygames()

			.success(function(user) {
          console.log(user);
          jdenticon.update("#userIdenticon", user.avatar);
					$scope.games = user.games;
          $scope.username = user.username;
					$scope.loading = false;
					$scope.mygames = true;
			});
		};

		// $scope.displayGames();

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
