angular
	.module('productFinder')
	.controller('homeCtrl', homeCtrl);



function homeCtrl($scope, $location, $timeout, productData, auth, locService) { // service as parameter

	$scope.lon2 = "";
	$scope.lat2 = "";

	navigator.geolocation.getCurrentPosition(function(position) {
		$scope.lon2 = position.coords.longitude;
		$scope.lat2 = position.coords.latitude;
		console.log($scope.lon2);

	});
	$("#wait").show();
	$('#show-products').css("display", "none");
	$timeout(function() {
		$("#wait").css("display", "none");
		$('#show-products').show();
		$("#search").show();
		//Sort: default is by name
		$scope.sortBy = 'name';

		$scope.filteredItems = [], $scope.currentPage = 0, $scope.numPerPage = 9, $scope.maxSize = 5;

		/* list of products from server */
		productData.productList()
			.success(function(data) {
				// $scope.data = {
				// 	products: data
				// };
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
					var begin = (($scope.currentPage) * $scope.numPerPage);
					$scope.end = begin + $scope.numPerPage;
					$scope.filteredItems = $scope.items.slice(begin);
				});

				$scope.disCalc = function(storelon, storelat, disObj) {
					return (locService.distance(storelon, storelat, $scope.lon2, $scope.lat2, disObj));

				};


			})
			.error(function(e) {
				console.log(e);
			});
	}, 3900);

	/* scroll to top when page changed */
	$('#pager-bottom button').click(function(){
		$(window).scrollTop(0);
	});


	// var key = " ";
	// $('#search').keypress(function(e) {
	// 	key = $('#search').val();
	// 	console.log('search home: ' + key);

	// 	productData.productSearch(key)
	// 		.success(function(data) {
	// 			$scope.items=data;
	// 		})
	// 		.error(function(e) {
	// 			console.log(e);
	// 		});
	// 	$route.reload();
	// });

}