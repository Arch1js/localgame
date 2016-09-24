// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var addCtrl = angular.module('mapCtrl', ['geolocation', 'gservice']);
addCtrl.controller('mapCtrl', function($scope, $http, $rootScope, geolocation, gservice, jdenticonService){

  $scope.maptab = 'active'; //set navbar map tab active

  jdenticonService.geticon()
  .success(function(data) {
    $scope.username = data.username;
    jdenticon.update("#identicon", data.avatar);
  })

    // Initializes Variables
    // ----------------------------------------------------------------------------
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
      console.log('no location');

        askLocation = true;

        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            // Set the latitude and longitude equal to the HTML5 coordinates
            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

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

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    $scope.askToRemeber = function() {
      BootstrapDialog.show({
          title: 'localGame',
            message: 'Can we save your location for next time?',
            buttons: [{
                label: 'Yes',
                cssClass: 'btn-success',
                action: function(dialog) {

                  queryBody = {
                      longitude: parseFloat($scope.formData.longitude),
                      latitude: parseFloat($scope.formData.latitude)
                  };
                  console.log(queryBody);
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

    // Take query parameters and incorporate into a JSON queryBody
    $scope.queryUsers = function(){


          geocoder = new google.maps.Geocoder();

          var address = $scope.formData.location;

          if(address) {

            geocoder.geocode( { 'address': address}, function(results, status) {

              if (status == 'OK') {
                console.log('Geocode OK');
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

    $scope.getQueryResults = function() {

      if(!$scope.formData.distance) {
        $scope.formData.distance = 10;
      }

              // Assemble Query Body
              queryBody = {
                  longitude: parseFloat($scope.formData.longitude),
                  latitude: parseFloat($scope.formData.latitude),
                  distance: parseFloat($scope.formData.distance)
              };

              // Post the queryBody to the /query POST route to retrieve the filtered results
              $http.post('/query', queryBody)

                  // Store the filtered results in queryResults
                  .success(function(queryResults){

                      // Pass the filtered results to the Google Map Service and refresh the map
                      gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                      // Count the number of records retrieved for the panel-footer
                      $scope.queryCount = queryResults.length;
                      $scope.usercount = true;
                  })
                  .error(function(queryResults){
                      console.log('Error ' + queryResults);
                  })
    }

    // Functions
    // ----------------------------------------------------------------------------
    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

});
