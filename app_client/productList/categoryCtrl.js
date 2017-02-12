angular
	.module('productFinder')
	.controller('categoryCtrl', categoryCtrl);

function categoryCtrl($scope, $routeParams, $timeout, productData, locService) {
	$scope.lon2 = "";
	$scope.lat2 = "";

	if (typeof(localStorage) != "undefined") { // if localStorage is not set, set it to stotre lat and lon

		navigator.geolocation.getCurrentPosition(function(position) {
			$scope.lon2 = position.coords.longitude;
			$scope.lat2 = position.coords.latitude;

			localStorage.setItem('latitude', position.coords.latitude); // store in localStorage
			localStorage.setItem('longitude', position.coords.longitude);

			// compare current location and localStorage location 
			if ($scope.lon2 != localStorage.getItem('longitude')) {
				localStorage.removeItem('latitude');
				localStorage.removeItem('longitude');
			}


		});


		if (localStorage.getItem('longitude')) {
			$scope.geolocation = true;
		} else {
			$scope.geolocation = false;
		}
	}

	$("#wait").show();
	$('#show-products').css("display", "none");

	$timeout(function() { // timeout just for testing purpose

		$("#wait").css("display", "none");
		$('#show-products').show();

		$('#search').show();
		$scope.categoryName = $routeParams.categoryName.toLowerCase(); // pass route params to controller 

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
						return (locService.distance(storelon, storelat, localStorage.getItem('longitude'), localStorage.getItem('latitude'), disObj));

					};
				}
			})
			.error(function(e) {
				console.log(e);
			});
	});
}