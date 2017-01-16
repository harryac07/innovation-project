// function distanceCalculation(userLat, userLng, restaurantObj, resLat, resLng) {

//       var R = 6371;
//       var dLat = deg2rad(resLat - userLat); // deg2rad below
//       var dLon = deg2rad(resLng - userLng);
//       var a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(resLat)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       var d = R * c;

//       //this functionality is only for search page for showing distance to each restaurant
//       if (restaurantObj !== "") {
//         restaurantObj.distanceKm = d;
//       }
//       console.log("The distance is " + d);
//       return d;
//     }

//     function deg2rad(deg) {

//       return deg * (Math.PI / 180);
//     }
//     return {
//       distanceCalculation: distanceCalculation
//     };
    
// $scope.distance = function(lat, lng, obj) {
//     return Math.round((commonServices.distanceCalculation(lat, lng, obj, $scope.lat, $scope.lng)) * 10) / 10;
//   };

// ng-init="distance=distance(result.lat,result.lng,result)"
// <span style="line-height:50px" ng-if="gotUserLocation" ng-init="distance=distance(result.lat,result.lng,result)">
//                   <i class="fa fa-car" aria-hidden="true"></i>
//                   {{distance}}
//                   Km</span>