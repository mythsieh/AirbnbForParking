angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout){
  // Controllers in Ionic are only called when they are recreated or on 
  // app start, instead of every page change

  // Form data for login modal
  $scope.loginData = {}

  // Create login modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal){
    $scope.modal = modal;
  })

  // Triggered in login modal to close
  $scope.closeLogin = function(){
    $scope.modal.hide();
  };

  //Open the login modal
  $scope.login = function(){
    $scope.modal.show();
  };

  // Perform login action when the user submits the login form
  $scope.doLogin = function(){
    console.log("Browser Console - Logging in with ", $scope.loginData);
    // Simulate a login delay.  Remove and replace later with login code and login system
    $timeout(function(){
      $scope.closeLogin();
    }, 1000);
  };
})

//retrieves results of search
.controller('SearchResultsCtrl', function($scope, $location, Search){
  // dummy data
  $scope.searches = [
    {id: 1, address: '1600 Amphitheatre Pkwy, Mountain View, CA', seller: 'Joe', price: 10, lat: 37.422245, lng: -122.0840084},
    {id: 2, address: '1 World Way, Los Angeles, CA', seller: 'John', price: 15, lat: 33.94224, lng: -118.40279},
    {id: 3, address: '652 Polk St San Francisco, CA', seller: 'Katherine', price: 20, lat: 37.78291, lng: -122.41902},
    {id: 4, address: 'Dick\'s Sporting Goods Concord, NH 03301 United States', seller: 'Christina', price: 25, lat: 43.22697, lng: -71.48562},
    {id: 5, address: 'Highland Middle School, 15027 Bel-Red Rd Bellevue, WA 98007, United States', seller: 'Bob', price: 30, lat: 47.62657, lng: -122.14020}
  ];

  // User lists address for rent
    // Geocode this at this time

  // Searches contains address and possibly lat and longitude, if contains lat and long then plot it,
  // but if doesn't then geocoding lookup of address, save the lat and long to the server by doing UPDATE request
  // for the specific id. 

  // If search address is not current location
    // Geocode the address searched for (not a listing address) and add marker at that address. 

  var map;

  //Called when input is submitted
  $scope.getSearches = function(input){
    // get coordinates for input
    var mapOptions;
    var myLatlng = $scope.AddressToLocation(input, function(location){

      console.log(location); // {H: 37.422245, L: -122.0840084}
      var mapOptions = {
        zoom: 19,
        // map gets centered here
        center: location
      };
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      $scope.addMarkerGeo(location, map);
      $scope.markers = $scope.searches.forEach(function(obj) {
        $scope.addMarker(obj,map);
      });
    });
  },

  // Add marker to map for the input to search bar
  $scope.addMarkerGeo = function(location, map) {
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      icon: './../img/green-dot.png',
        //map type
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    return marker;
  },

  // Get latitude and longitude coords from Address
  $scope.AddressToLocation = function(addressString, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': addressString}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('inside');
        callback(results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  // Add marker while iterating through array of database results
  $scope.addMarker = function(obj, map) {
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(obj.lat,obj.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    return marker;
  }

  $scope.addressArray = function(queryArray) {
    return _.map(queryArray, function(element){
      if (element.address !== undefined)
        return element.address;
    });
  }

  //API call when ready
  // $scope.searches = Search.query();
})

// Retrieves a specific search using the Search service and store it in scope
.controller('SearchResultCtrl', function($scope, $stateParams, Search){
  $scope.search = Search.get({id: $stateParams.searchId});
})

.controller('MapController', function($scope, $ionicLoading) {
    console.log("MapController");
    $scope.initialise = function() {
        console.log("In Google.maps.event.addDomListener");
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 19,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        console.log(mapOptions);
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var marker;

        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos);
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;

        google.maps.event.addListener(map, 'click', function(event) {
            if (marker) { 
              marker.setMap(null); 
            }
            marker = new google.maps.Marker({ position: event.latLng, map: map});
        });
    };
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());


})

.controller('ListingCtrl', function($scope){

  $scope.submitListing = function(listing){
    console.log(listing);
  }

});









