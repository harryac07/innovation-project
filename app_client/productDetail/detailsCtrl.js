angular
	.module('productFinder')
	.controller('productDetailCtrl', productDetailCtrl);

function productDetailCtrl($scope, $routeParams, $window, $timeout, productData, auth, locService) {

	$scope.lon2 = "";
	$scope.lat2 = "";

	navigator.geolocation.getCurrentPosition(function(position) {
		$scope.lon2 = position.coords.longitude;
		$scope.lat2 = position.coords.latitude;
		console.log($scope.lon2);

	});

	$scope.productid = $routeParams.productid; // pass route params to controller 
	$scope.header = {
		title: $scope.productid
	};
	/* Verify if user logged in */
	$scope.isLoggedIn = auth.isLoggedIn();

	$("#wait-detail").show();
	$('#detail-body').css("display", "none");

	$timeout(function() {

		$("#wait-detail").css("display", "none");
		$('#detail-body').show();

		productData.productById($scope.productid)
			.success(function(data) {

				// $scope.dis = function(storelat, storelon) {
				// 	return (locService.distance(storelon, storelat, $scope.lon2, $scope.lat2));
				// };
				$scope.distance = locService.distance(data.store[0].coords[0], data.store[0].coords[1], $scope.lon2, $scope.lat2, 1); // from locService
				console.log($scope.lon2 + ',' + data.store[0].coords[0]);
				//Total number of reviews
				console.log('reviews count: ' + data.review.length);
				if (data.review.length < 4) {
					$('#moreReview').hide();
				}
				//call average rating
				averageRating(data);
				$scope.data = {
					product: data
				};
				/* handling the review limit */
				$scope.limit = $scope.data.product.review.length;

			})
			.error(function(e) {
				console.log(e);
			});

		//review submit 
		$scope.onSubmit = function() {
			$scope.formError = "";
			if (!$scope.formData.rating || !$scope.formData.reviewText) {
				$scope.formError = "All fields are required!";
				return false; // prevent from submission and reload
			} else {
				$scope.doAddReview($scope.productid, $scope.formData); //on succes, call this function to send detail
				$window.location.reload();
			}
		};

		/* Add review starts from here */

		$scope.doAddReview = function(productid, formData) {
			productData.addReviewById(productid, {
					author: auth.currentUser().name, //--> it comes from loggedin user auth
					rating: formData.rating,
					reviewText: formData.reviewText
				})
				.success(function(data) {
					console.log('Add Review success!');
					$("#reviewModel").modal("hide"); // hide modal after review is sent
				})
				.error(function(data) {
					$scope.formError = 'Review submission failed. Try Again!';
				});
			return false; // prevent from submission and reload
		};

		//Calculating Average rating
		var averageRating = function(data) {
			var arr = []; // storage for ratings
			var ratingSum = 0;
			var actualRating = 0; // average rating

			for (var i = 0; i < data.review.length; i++) {
				arr.push(data.review[i].rating);
			}

			for (var i = 0; i < arr.length; i++) {
				ratingSum = arr[i] + ratingSum;
			}
			//console.log(ratingSum);
			actualRating = (ratingSum / arr.length) || 0;
			$scope.actual = Math.round(actualRating * 100) / 100;
			$scope.average = parseInt(actualRating);
			//console.log('Average rating: ' + $scope.average);
		};

		//JQuery handler for the page

		$("#search").hide();

		$('#moreReview').on('click', function() {
			$('#moreReview').hide();
		});
		$('#productShare').click(function() {
			$('#text').val($window.location.href);
		});

	}, 3800);


}

// similar behavior as an HTTP redirect
// window.location.replace("http://stackoverflow.com");

// // similar behavior as clicking on a link
// window.location.href = "http://stackoverflow.com";