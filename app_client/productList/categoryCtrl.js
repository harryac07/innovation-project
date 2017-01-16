angular
	.module('productFinder')
	.controller('categoryCtrl', categoryCtrl);

function categoryCtrl($scope, $routeParams, $timeout, productData, locService) {
	$scope.lon2 = "";
	$scope.lat2 = "";

	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function(position) {
			$scope.lon2 = position.coords.longitude;
			$scope.lat2 = position.coords.latitude;

			// show distance in home page only if geolocation is on 
			if (!($scope.lon2 === undefined || $scope.lat2 === undefined)) {
				$scope.geolocation = true;

				$scope.disCalc = function(storelon, storelat, disObj) {
					return (locService.distance(storelon, storelat, $scope.lon2, $scope.lat2, disObj));

				};
			} else {
				$scope.geolocation = false;
			}


		});
	} else {
		console.log("Geolocation is not supported by this browser.");
	} /* .geolocation ends here */


	$("#wait").show();
	$('#show-products').css("display", "none");

	$timeout(function() { // timeout just for testing purpose

		$("#wait").css("display", "none");
		$('#show-products').show();

		$('#search').show();
		$scope.categoryName = $routeParams.categoryName.toLowerCase(); // pass route params to controller 
		// var key = " ";

		// $('#search').keypress(function(e) { // if enter is hit 
		// 	if (e.which === 13) {
		// 		key = $('#search').val();
		// 		console.log('search home: ' + key);

		// 		productData.productSearch(key)
		// 			.success(function(data) {
		// 				$scope.data = {
		// 					store: data
		// 				};
		// 			})
		// 			.error(function(e) {
		// 				console.log(e);
		// 			});
		// 		$route.reload();
		// 	}
		// });
		$scope.filteredItems = [], $scope.currentPage = 0, $scope.numPerPage = 9, $scope.maxSize = 5;
		productData.productByCategory($scope.categoryName)
			.success(function(data) {
				// $scope.data = {
				// 	products: data
				// };
				/* For pagination */
				$scope.makeItems = function() {
					$scope.items = [];
					for (i = 0; i < data.length; i++) {
						$scope.items.push(data[i]);
					}
				};
				$scope.makeItems();
				console.log($scope.items);

				$scope.numberOfPages = function() {
					return Math.ceil($scope.items.length / $scope.numPerPage);
				};
				$scope.$watch('currentPage', function() {
					var begin = (($scope.currentPage) * $scope.numPerPage),
						end = begin + $scope.numPerPage;
					$scope.filteredItems = $scope.items.slice(begin);
				});
				/* Pagination ends here */

				if ($scope.geolocation == true) { // if geolocation is on and lat lon is provided 
					$scope.disCalc = function(storelon, storelat, disObj) {
						return (locService.distance(storelon, storelat, $scope.lon2, $scope.lat2, disObj));

					};
				}
			})
			.error(function(e) {
				console.log(e);
			});
	});
}