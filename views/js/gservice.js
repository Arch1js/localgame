// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){
          var googleMapService = {};
          googleMapService.clickLat  = 0;
          googleMapService.clickLong = 0;

          var locations = [];
          var lastMarker;
          var currentSelectedMarker;

          var selectedLat = 51.502;
          var selectedLong = -0.110;

        googleMapService.refresh = function(latitude, longitude,filteredResults){
            locations = [];

            selectedLat = latitude;
            selectedLong = longitude;

            if (filteredResults){
                locations = convertToMapPoints(filteredResults);

                initialize(latitude, longitude, true);
            }
            else {
                initialize(latitude, longitude, false);
          }
        };

        var convertToMapPoints = function(response){

            var locations = [];

            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                var  contentString =
                    '<p><b><a href="/user/?id=' + user._id+'" target="_blank">'+ user.username +'</a></b><br>'+
                    '<canvas width="40" height="40" data-jdenticon-hash="'+user.avatar+'"></canvas>';

                if(!user.location) {
                  break;
                }
                else {
                  locations.push({
                          latlon: new google.maps.LatLng(user.location.lat, user.location.lng),
                          title: user.username,
                          message: new google.maps.InfoWindow({
                              content: contentString,
                              maxWidth: 320
                          }),
                      });
              }
        }
        return locations;
    };

var initialize = function(latitude, longitude, filter) {

    var myLatLng = {lat: selectedLat, lng: selectedLong};

    if (!map){
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: myLatLng
        });
    }

    if(filter){
      icon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      map.setZoom(14);
    }
    else {
      icon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      map.setZoom(12);
    }

    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: ''+n.title+'',
            icon: icon,
        });

        google.maps.event.addListener(marker, 'click', function(e){

            currentSelectedMarker = n;
            n.message.open(map, marker);
            jdenticon();
        });
    });

    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        // animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    map.panTo(new google.maps.LatLng(latitude, longitude));

    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        if(lastMarker){
            lastMarker.setMap(null);
        }

        lastMarker = marker;
        map.panTo(marker.position);

        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
