angular
	.module('productFinder')
	.service('locService', locService);


function locService($window) {
	// /* Distance calculation */
	var distance = function(lon1, lat1, lon2, lat2, disObj) { // store lon1 and lat1
		// /* Distance calculation */
		var R = 6371;
		var dLat = deg2rad(lat2 - lat1); // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		//var d = R * c; 
		var d = Math.round(R * c * 10) / 10; // Distance in km
		//for sorting the products by distance
		if (disObj !== "") {
			disObj.dis = d;
		}

		function deg2rad(deg) {
			return deg * (Math.PI / 180)
		}
		console.log('service distance: ' + d);
		return d;
	};
	return {
		distance: distance
	};
}