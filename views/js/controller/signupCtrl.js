
var app = angular.module('gameApp', [], function() {} );

app.directive('match', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {
        return $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('mismatch', currentValue);
      });
    }
  };
});

app.controller('signupCtrl', function ($scope) {
  $scope.fields = {
    password: '',
    repeat_password: ''
  };
});
