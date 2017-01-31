var app = angular.module('gameApp', ['ui.bootstrap','profileCtrl', 'headerCtrl','navbarCtrl', 'profileService','jdenticonService', 'ngRoute'])

// Configures Angular routing -- showing the relevant view and controller when needed.
.config(function($routeProvider){

    // Join Team Control Panel
    $routeProvider.when('/mygames', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/mygames.html',

    // Find Teammates Control Panel
  }).when('/friendrequests', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/friendRequests.html',

    // All else forward to the Join Team Control Panel
  }).when('/gamerequests', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/gameRequests.html',

    // All else forward to the Join Team Control Panel
  }).when('/friends', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/friends.html',

    // All else forward to the Join Team Control Panel
  }).when('/messages', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/messages.html',

    // All else forward to the Join Team Control Panel
  }).otherwise({redirectTo:'/'})
});
