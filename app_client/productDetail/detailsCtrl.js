angular
	.module('productFinder')
	.controller('productDetailCtrl', productDetailCtrl);

function productDetailCtrl($scope, $routeParams, $window, $timeout, productData, auth, locService) {

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


		if (!(localStorage.getItem('longitude') == "undefined")) {
			$scope.geolocation = true;
		} else {
			$scope.geolocation = false;
		}
		console.log(localStorage.getItem('latitude'));
		console.log(localStorage.getItem('longitude'));

	}


	$scope.productid = $routeParams.productid; // pass route params to controller 
	$scope.header = {
		title: $scope.productid
	};
	/* Verify if user logged in */
	$scope.isLoggedIn = auth.isLoggedIn();

	$("#wait-detail").show();
	$('#detail-body').css("display", "none");

	$timeout(function() { // timeout just for testing purpose

		$("#wait-detail").css("display", "none");
		$('#detail-body').show();

		productData.productById($scope.productid)
			.success(function(data) {

				// $scope.dis = function(storelat, storelon) {
				// 	return (locService.distance(storelon, storelat, $scope.lon2, $scope.lat2));
				// };
				
				/*Calculate distance only if geolocation works */
				if ($scope.geolocation == true) {
					$scope.distance = locService.distance(data.store[0].coords[0], data.store[0].coords[1], localStorage.getItem('longitude'), localStorage.getItem('latitude'), 1); // from locService
				}
				//Total number of reviews
				
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

				/* handling the product details with linke break and spaces*/
				$scope.content = data.varient[0].sizeDetail[0].detail.replace(/\r?\n/g, '<br />'); // actual product detail

			})
			.error(function(e) {
				console.log(e);
			});

		//review submit 
		$scope.formData={
			rating:"",
			reviewText:""
		};
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

	});


}

// similar behavior as an HTTP redirect
// window.location.replace("http://stackoverflow.com");

// // similar behavior as clicking on a link
// window.location.href = "http://stackoverflow.com";