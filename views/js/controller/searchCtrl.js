angular.module('searchController', ['ui.bootstrap'])

	.controller('searchGamesCtrl', function($scope, $http, Games) {
		$scope.loading = true;

		$scope.gametab = 'active'; //set navbar games tab active

		// jdenticonService.geticon()
		// .success(function(data) {
		// 	$scope.username = data.username;
		// 	jdenticon.update("#identicon", data.avatar);
		// });

		$scope.formData = {};

		$scope.imgError = function() {
		};
		$scope.getNewestGames = function() {
			Games.getNewest()

			.success(function(data) {
				console.log(data);
				$scope.loading = false;
				$scope.games = data;
			});
		}

		$scope.getNewestGames();

		$scope.sugestions = function(val) {

			var output = $.ajax({
			    url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&search='+val,
			    type: 'GET',
			    data: {},
			    dataType: 'json',
			    success: function(data) {
			        },
			    error: function(err) { alert(err); },
			    beforeSend: function(xhr) {
			    xhr.setRequestHeader("X-Mashape-Authorization", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB"); // Enter here your Mashape key
			    }
			});
			return output;
		};

		$scope.searchGame = function() {
			$scope.error = false;
			$scope.games = false;
			$scope.loading = true;

			var search = $scope.search;
			console.log(search);
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


		$scope.askPlatform = function(i) {
			BootstrapDialog.show({
					title: '<img width="100px" height="40px" alt="Brand" src="../../asets/logo_title.svg">',
						message: '<h3>Please choose your platform!</h3>',
						buttons: [{
								label: '<img id="playstation" src="../../asets/PlayStation.png" /><b>PlayStation</b>',
								cssClass: 'btn-info',
								action: function(dialog) {
									var platform = "PlayStation";
									$scope.addGame(i,platform);
									dialog.close();
								}
						}, {
								label: '<img id="xbox" src="../../asets/Xbox.png" /><b>xBox</b>',
								cssClass: 'btn-success',
								action: function(dialog) {
									var platform = "XBox";
									$scope.addGame(i,platform);
									dialog.close();
								}
						}, {
							label: '<img id="steam" src="../../asets/PC.png" /><b>PC</b>',
							cssClass: 'btn-warning',
							action: function(dialog) {
								var platform = "PC";
								$scope.addGame(i,platform);
								dialog.close();
							}
						}, {
							label: '<img id="nintendo" src="../../asets/Nintendo.png" />',
							cssClass: 'btn-primary',
							action: function(dialog) {
								var platform = "Nintendo";
								$scope.addGame(i,platform);
								dialog.close();
							}
						}]
				});
		}

		$scope.addGame = function(i,p) {
			var title = i.name;
			toastr.options = {
				"positionClass": "toast-bottom-left",
			};
			var addMessage = title + ' added to your collection!';
			toastr.success(addMessage);

			console.log('addGame function fired');

			var id = i.id;
			var name = i.name;
			var platform = p;

			if(i.cover == undefined) {
				var cover = 'nocover_qhhlj6';
			}
			else {
				var cover = i.cover.cloudinary_id;
			}

			Games.create(id, name, cover, platform);
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
