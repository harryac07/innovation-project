// angular
// 	.module('productFinder' /*, ['angular-cloudinary']*/ )
// 	// // Configure the cloudinary service
// 	// .config(function(cloudinaryProvider) {
// 	// 	.cloudinaryProvider.config({
// 	// 		upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
// 	// 		cloud_name: 'haria', // required
// 	// 		upload_preset: 'my_preset', // optional
// 	// 	});
// 	// })
// 	.controller('postproductCtrl', postproductCtrl);

// function postproductCtrl($scope, cloudinary, $routeParams, $window, productData) { // service as parameter
// 	$scope.storeid = $routeParams.storeid; // pass route params to controller 

// 	$scope.onSubmit = function() {
// 		//cloudinary.upload($scope.image, function(result) { /* cloudinary options here */
// 		productData.postproduct('580e3c9e31275e040794d1f1', {

// 				name: $scope.name,
// 				brand: $scope.brand,
// 				store: $scope.store,
// 				image: $scope.image,
// 				category: $scope.category,
// 				color: $scope.color,
// 				size: $scope.size,
// 				available: $scope.available,
// 				detail: $scope.detail,
// 				price: $scope.price,
// 				url: $scope.url,
// 				manufactured: $scope.manufactured,
// 				expiry: $scope.expiry
// 			}).success(function(data) {
// 				console.log('post product success!');
// 			})
// 			.error(function(err) {
// 				$scope.formError = err;
// 			});
// 	})
// .then(function(resp) {
// 	alert('all done!');
// });
// $window.location.href='/';


// //};
// }

// // angular
// // // Include the angular-cloudinary module
// // 	.module('myModule', ['angular-cloudinary'])
// // 	// Configure the cloudinary service
// // 	.config(function(cloudinaryProvider) {
// // 		cloudinaryProvider.config({
// // 			upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
// // 			cloud_name: 'my_cloudinary_cloud_name', // required
// // 			upload_preset: 'my_preset', // optional
// // 		});
// // 	})
// // 	// Inject the `cloudinary` service in your controller
// // 	.controller('myController', function($scope, cloudinary) {
// // 		// Have a way to see when a file should be uploaded
// // 		$scope.$watch('myFile', function(myFile) {
// // 			// Use the service to upload the file
// // 			cloudinary.upload(myFile, { /* cloudinary options here */ })
// // 				// This returns a promise that can be used for result handling
// // 				.then(function(resp) {
// // 					alert('all done!');
// // 				});
// // 		});
// // 	});