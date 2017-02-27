angular.module('profileCtrl', ['ui.bootstrap'])

	// inject the service factory into our controller
	.controller('profileCtrl', function($scope, $http,$timeout, profile, jdenticonService) {

		$scope.loading = true;
		$scope.hometab = 'active'; //set navbar home tab active

		var sessionUser = undefined;
		$scope.sessionUser2 = '';
		var userToSend = undefined;
		var roomID = undefined;
		var convoID = undefined;

		profile.getSession()
			.success(function(user) {
				sessionUser = user;
				$scope.sessionUser2 = user;
				socket.emit('set nickname', user);
		});

$scope.getUnreadMessageCount = function() {
	profile.getUnreadCount()
	.success(function(notifications) {
		document.getElementById('msgBadge').innerHTML = notifications.count;
	});
}
$scope.getGameRequestCount = function() {
	var game = "game";
	profile.getRequestCount(game)
	.success(function(count) {
		if (count[0] != undefined) {
			document.getElementById('gameBadge').innerHTML = count[0].count;
			document.getElementById('reqBadge').innerHTML = "New";
		}

	})
}

$scope.getFriendRequestCount = function() {
	var friends = "friends";
	profile.getRequestCount(friends)
	.success(function(count) {
		if (count[0] != undefined) {
			document.getElementById('friendBadge').innerHTML = count[0].count;
			document.getElementById('reqBadge').innerHTML = "New";
		}
	})
}

$scope.getUnreadMessageCount();
$scope.getGameRequestCount();
$scope.getFriendRequestCount();
/////////////////// My games tab functions/////////////////////
$scope.displayGames = function() {

	profile.getmygames()

	.success(function(user) {
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
				$timeout(function() {
					$scope.loading = false;
					$scope.mygames = true;
	    }, 1000);
				$scope.games_error = false;
			}
	});
};

$scope.removeGame = function(i) {
	var title = i.name;
	var id = i.id;

	toastr.options = {
		"positionClass": "toast-bottom-left",
	};
	var removeMessage = title + ' removed from your collection!';
	toastr.warning(removeMessage);

	profile.removegame(id)
	.success(function() {
		$scope.displayGames();
	});
};

////////////////////////////////////////////////////////////////////////

/////////////////// Game requests tab functions/////////////////////

		$scope.getGameRequests = function() {
			$scope.requests = false;
			$scope.game_requests = {};
			profile.getGameRequests()

			.success(function(requests) {
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

		$scope.acceptGameRequest = function(i) {
			$scope.askToSendConfirm(i);
		}

		$scope.declineRequest = function(i) {
			var req_id = i.id;
			profile.deleteGameRequest(req_id);
			$scope.getGameRequests();
		}

//////////////////////////////////////////////////////////////////////

/////////////////// Friend requests tab functions/////////////////////

$scope.getFriendRequests = function() {
	$scope.requests = false;
	$scope.friendrequests = {};

	profile.getFriendRequests()
	.success(function(friendrequests) {
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

///////////////////////////////////////////////////////////////////

/////////////////// Friends tab functions/////////////////////
	$scope.getFriends = function() {
		$scope.friends = false;
		$scope.friends = {};

		profile.getFriends()
		.success(function(friends) {
			if(friends.friends == 0) {
				$scope.friend_error = true;
				$scope.friends = true;
			}
			else {
				$scope.friends = friends;
				$scope.user_friends = true;
				$scope.loading = false;
			}
		});
	};
//////////////////////////////////////////////////////////////////////////

/////////////////// Messages tab functions/////////////////////

///////// Conversations /////////////////////
	$scope.getAllConversations = function() {
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

///////////////////////////////////////////////

/////////// Messages //////////////////////////

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
			console.log(messages);
			$scope.messages = messages;
			$scope.getUnreadMessageCount();
		});
	}

		$('#newMessage').on('shown.bs.modal', function (e) {
		  $scope.getFriends();
		})

		$scope.sendChat = function() {
			var user = userToSend;
			var message = $('#chatmessage').val();
			socket.emit('chat message', {room: roomID, convoID: convoID, msg: message, toUser: user});
			var date = new Date();
			var dateNow = date.getDate();
			var month = date.getMonth() +1;
			var year = date.getFullYear();
			var time = date.toLocaleTimeString();
				var message = $(
		      '<ul class="chats">'+
					'<li class="me">'+
						'<div class="image">' +
							'<img src="../asets/unnamed.jpg" />' +
							'<b>'+ sessionUser +'</b>' +
						'</div>' +
							'<p>'+ message +'<br><p1><font size="2">'+time + ' '+dateNow+'/'+month+'/'+year+'</font></p1></p>' +
					'</li>'+
		    '</ul>');

		    $('.chatscreenNew').append(message);
				$('#chatmessage').val('');
				$scope.scrollToBottom();
				$scope.unreadCount = 0;
		}

		$scope.sendMessage = function() {
			var to = $scope.to.username;
			var message = $scope.message;

			$('#newMessage').modal('hide');
			profile.sendMessage(to, message);
		}

/////// Setting positions and styles ////////////////

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

		$scope.determineUser = function(user1,user2) {
			if(user1 == sessionUser) {
				userToSend = user2;
			}
			else {
				userToSend = user1;
			}
		}
//////////////////////////////////////////////////////////////
		$scope.hideLoading = function() {
			$scope.loading = true;
			$scope.conversations = false;
		}
	})
	.directive('lastElementDirective', function($timeout) {
  return function(scope, element, attrs) {
    if (scope.$last){
			$timeout(function() {
				jdenticon();
    }, 1);
    }
  }})
