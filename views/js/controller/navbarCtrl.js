var navbarCtrl = angular.module('navbarCtrl', [])

	navbarCtrl.controller('navbarCtrl', function($scope, $http, jdenticonService) {
		jdenticonService.geticon()
		.success(function(data) {
			$scope.username = data.username;
			jdenticon.update("#identicon", data.avatar);
		});
	})
