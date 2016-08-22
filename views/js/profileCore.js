var app = angular.module('gameApp', ['profileCtrl', 'headerCtrl', 'profileService','jdenticonService', 'ngRoute'])

// Configures Angular routing -- showing the relevant view and controller when needed.
.config(function($routeProvider){

    // Join Team Control Panel
    $routeProvider.when('/mygames', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/mygames.html',

    // Find Teammates Control Panel
  }).when('/requests', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/requests.html',

    // All else forward to the Join Team Control Panel
  }).when('/friends', {
        controller: 'profileCtrl',
        templateUrl: '/js/partials/friends.html',

    // All else forward to the Join Team Control Panel
  }).otherwise({redirectTo:'/'})
});
