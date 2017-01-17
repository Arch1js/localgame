var profileCtrl = angular.module('profileCtrl', ['ui.bootstrap'])

	// inject the service factory into our controller
	profileCtrl.controller('profileCtrl', function($scope, $http, profile, jdenticonService) {

		$scope.loading = true;

		$scope.hometab = 'active'; //set navbar home tab active

		var sessionUser = undefined;
		$scope.sessionUser2 = '';
		var userToSend = undefined;
		var roomID = undefined;
		var convoID = undefined;

		jdenticonService.geticon()
		.success(function(data) {
			$scope.username = data.username;
			jdenticon.update("#identicon", data.avatar);
			profile.getSession()
			.success(function(user) {
				sessionUser = user;
				$scope.sessionUser2 = user;
			});
		});

		$scope.askToSendConfirm = function(i) {
			var gameID = i.id;
      BootstrapDialog.show({
          title: '<img width="100px" height="40px" alt="Brand" src="../../asets/logo_title.svg">',
            message: '<b>Can we send message to user confirming your decision?<b>',
            buttons: [{
                label: 'Yes',
                cssClass: 'btn-success',
                action: function(dialog) {
									var to = i.username;
									var game = i.game;
									var message = 'Hey! I see that you have shown interest in ' + game;

									profile.sendMessage(to, message);
									profile.deleteGameRequest(gameID);
									$scope.getGameRequests();
									toastr.options = {
										"positionClass": "toast-bottom-left",
									};
									var aceptMessage = 'Message has been sent!';
									toastr.success(aceptMessage);

									dialog.close();
                }
            }, {
                label: 'No',
                cssClass: 'btn-warning',
                action: function(dialog) {
									profile.deleteGameRequest(gameID);
                  dialog.close();
                }
            }]
        });
    }

		$('#newMessage').on('shown.bs.modal', function (e) {
		  $scope.getFriends();
		})

		$scope.acceptGameRequest = function(i) {
			$scope.askToSendConfirm(i);
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
					$scope.loading = false;
					$scope.request_error = true;
				}
				else {
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
					$scope.loading = false;
					$scope.gamerequest_error = true;
				}
				else {
					$scope.gamerequests = requests.gameRequests;
					$scope.game_requests = true;
					$scope.loading = false;
				}

			});
		};

		$scope.getFriends = function() {
			$scope.friends = false;
			$scope.friends = {};
			profile.getFriends()

			.success(function(friends) {

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

			profile.getmygames()

			.success(function(user) {
          // console.log(user);
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

			profile.getSession()
			.success(function(user) {
				socket.emit('set nickname', user);
			});

		};

		$scope.sendChat = function() {
			var user = userToSend;
			var message = $('#chatmessage').val();
			socket.emit('chat message', {room: roomID, convoID: convoID, msg: message, toUser: user});

				var message = $(
		      '<ul class="chats">'+
					'<li class="me">'+
						'<div class="image">' +
							'<img src="../asets/unnamed.jpg" />' +
							'<b>'+ sessionUser +'</b>' +
						'</div>' +
						'<p>'+ message +'</p>' +
					'</li>'+
		    '</ul>');

		    $('.chatscreenNew').append(message);
				$('#chatmessage').val('');
				$scope.scrollToBottom();
		}
		$scope.setPosition = function(from) {
			if(from == sessionUser) {
				var style = 'me';
				return style;
			}
			else {
				var style = 'you';
				return style;
			}

		}
		$scope.scrollToBottom = function() {
			var container = $('.messageView');
			var height = container[0].scrollHeight;
			container.animate({scrollTop: height},1000);
		}


		$scope.sendMessage = function() {
			var to = $scope.to;
			var message = $scope.message;

			profile.sendMessage(to, message);
		}
		$scope.loadMessages = function(id, room, participants) {
			var participant1 = participants[0];
			var participant2 = participants[1];
			roomID = room;

			socket.emit('join room', {room: room});

			$scope.determineUser(participant1,participant2);

			$scope.messages_view = true;
			$scope.chat_view = true;

			convoID = id;

			profile.getMessages(convoID)
			.success(function(messages) {
				$scope.messages = messages;
			});
		}

		$scope.determineUser = function(user1,user2) {
			if(user1 == sessionUser) {
				userToSend = user2;
			}
			else {
				userToSend = user1;
			}
		}

		$scope.getConversations = function() {
			// socket.emit('set nickname', sessionUser);
			$scope.conversations = true;
			$scope.loading = true;
			$scope.messages_view = true;

			$scope.getConversations = {};
			profile.getConversations()
			.success(function(conversation) {
				if(conversation.length == 0) {
					$scope.msg_err = true;
					$scope.loading = false;
					$scope.messages_view = false;
				}
				else {
					$scope.conversation = conversation;
					$scope.loading = false;
					$scope.messages_view = false;
				}

			});
		}

		$scope.hideLoading = function() {
			$scope.loading = true;
			$scope.conversations = false;
		}

		$scope.removeGame = function(i) {
			var id = i.id;

			toastr.options = {
				"positionClass": "toast-bottom-left",
			};
			var removeMessage = 'Game removed from your collection!';
			toastr.warning(removeMessage);

			profile.removegame(id)
			.success(function() {
				$scope.displayGames();
			});
		}

	});
