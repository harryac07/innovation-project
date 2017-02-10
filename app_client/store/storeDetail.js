angular
	.module('productFinder')
	.controller('storeDetailCtrl', storeDetailCtrl);


function storeDetailCtrl($scope, $routeParams, $timeout, $window, productData, locService) { // service as parameter
	$scope.go_back = function() { // for back to previous page
		$window.history.back();
	};

	if (typeof(localStorage) != "undefined") { // if localStorage is not set, set it to stotre lat and lon

		navigator.geolocation.getCurrentPosition(function(position) {
			$scope.pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			// compare current location and localStorage location 
			if ($scope.pos.lng != localStorage.getItem('longitude')) {
				localStorage.removeItem('latitude');
				localStorage.removeItem('longitude'); // remove first and then.....

				localStorage.setItem('latitude', position.coords.latitude); // store in localStorage
				localStorage.setItem('longitude', position.coords.longitude);
			}



		});


		if (!(localStorage.getItem('longitude') == "undefined")) {
			$scope.geolocation = true;
		} else {
			$scope.geolocation = false;
		}
	}


	var arr = [];

	$scope.storeid = $routeParams.storeid;
	productData.storeDetail($scope.storeid)
		.success(function(data) {
			$scope.data = {
				store: data
			};
			arr.push(data.coords[1], data.coords[0]);

		})
		.error(function(e) {
			console.log(e);
		});


	//Map starts here

	$scope.mapinit = function() {
		console.log(arr);
		$timeout(function() {
			var pointA = new google.maps.LatLng(localStorage.getItem('latitude'), localStorage.getItem('longitude')), // user lat lng
				pointB = new google.maps.LatLng(arr[0], arr[1]), // store lat lng
				myOptions = {
					zoom: 7,
					center: pointA
				},
				map = new google.maps.Map(document.getElementById('map'), myOptions),
				// Instantiate a directions service.
				directionsService = new google.maps.DirectionsService,
				directionsDisplay = new google.maps.DirectionsRenderer({
					map: map
				}),
				markerA = new google.maps.Marker({
					position: pointA,
					title: "point A",
					label: "A",
					map: map
				}),
				markerB = new google.maps.Marker({
					position: pointB,
					title: "point B",
					label: "B",
					map: map
				});

			// get route from A to B
			calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
			//on change travelmode handler
			document.getElementById('mode').addEventListener('change', function() {
				calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
			});
		}, 500);
	};
	/*map ends here*/
	function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
		var selectedMode = document.getElementById('mode').value;
		directionsService.route({
			origin: pointA,
			destination: pointB,
			travelMode: google.maps.TravelMode[selectedMode]
		}, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				var distance = 0;
				for (i = 0; i < response.routes[0].legs.length; i++) {
					distance += parseFloat(response.routes[0].legs[i].distance.text);
					//for each 'leg'(route between two waypoints) we get the distance and add it to the total
				}
				console.log('this is distance: ' + distance);
				// Display the distance:
				$('#distance').text('Distance from you: ' + distance + ' KM  ( ' + selectedMode.toLowerCase() + ')');
				// display time to travel
				$('#time').text('Travel time: ' + response.routes[0].legs[0].duration.text + ' ( ' + selectedMode.toLowerCase() + ')');
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}



}