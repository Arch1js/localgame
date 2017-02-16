// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
angular.module('mapCtrl', ['geolocation', 'gservice','ui.bootstrap'])
.controller('mapCtrl', function($scope, $http, $rootScope, geolocation, gservice, jdenticonService){

  $scope.maptab = 'active'; //set navbar map tab active

  jdenticonService.geticon()
  .success(function(data) {
    $scope.username = data.username;
    jdenticon.update("#identicon", data.avatar);
  });

    $scope.formData = {};
    var queryBody = {};
    var coords = {};
    var lat = 0;
    var long = 0;
    var geocoder;
    var askLocation;

    $http.post('/userLocation')
    .success(function(result){

      if(!result.location) {
        askLocation = true;

        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            // Set the latitude and longitude equal to the HTML5 coordinates
            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
            $scope.askToRemeber();
            gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
        });
      }
      else {
        askLocation = false;
        $scope.formData.latitude = result.location.lat;
        $scope.formData.longitude = result.location.lng;
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      }
      jdenticon.update("#identicon", result.avatar);
    })

    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    $scope.sugestions = function(val) {
      console.log(val);
			var output = $.ajax({
			    url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&search='+val,
			    type: 'GET',
			    data: {},
			    dataType: 'json',
			    success: function(data) {
            console.log(data);
			        },
			    error: function(err) { alert(err); },
			    beforeSend: function(xhr) {
			    xhr.setRequestHeader("X-Mashape-Authorization", "A0XH7oOSxqmshUWW2RKqSKJBx9X9p1GgsC8jsnl1jpgAIMfTfB"); // Enter here your Mashape key
			    }
			});
			return output;
		};

    $scope.askToRemeber = function() {
      BootstrapDialog.show({
          title: '<img width="100px" height="40px" alt="Brand" src="../../asets/logo_title.svg">',
            message: 'Can we save your location for future use?',
            buttons: [{
                label: 'Yes',
                cssClass: 'btn-success',
                action: function(dialog) {

                  queryBody = {
                      longitude: parseFloat($scope.formData.longitude),
                      latitude: parseFloat($scope.formData.latitude)
                  };
                  $http.post('/saveLocation', queryBody);

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

    $scope.queryUsers = function(){
          geocoder = new google.maps.Geocoder();

          var address = $scope.formData.location;

          if(address) {

            geocoder.geocode( { 'address': address}, function(results, status) {

              if (status == 'OK') {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();

                $scope.formData.latitude = parseFloat(results[0].geometry.location.lat()).toFixed(3);
                $scope.formData.longitude = parseFloat(results[0].geometry.location.lng()).toFixed(3);

                if(askLocation == true) {
                  $scope.askToRemeber();
                }

                $scope.getQueryResults();
              }
             else {
              console.log('Failed' + status);
            }
          })
          }
          else {
            $scope.getQueryResults();
          }
      };
    $scope.update = function() {
      jdenticon();
    }

    $scope.getQueryResults = function() {

      if(!$scope.formData.distance) {
        $scope.formData.distance = 10;
      }
              queryBody = {
                  longitude: parseFloat($scope.formData.longitude),
                  latitude: parseFloat($scope.formData.latitude),
                  distance: parseFloat($scope.formData.distance),
                  game: $scope.search
              };
              $http.post('/query', queryBody)
                  .success(function(queryResults){
                      gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);
                      $scope.queryCount = queryResults.length;
                      $scope.usercount = true;
                  })
                  .error(function(queryResults){
                      console.log('Error ' + queryResults);
                  })
    }

    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

});
