angular
	.module('productFinder')
	.controller('registerCtrl', registerCtrl);


function registerCtrl($scope, $routeParams, $location, productData, auth) { // service as parameter(auth-authentication)

	$scope.credentials = {
		name: "",
		email: "",
		password: ""
	};
	$scope.verifyStatus = "";

	if ($routeParams.token) { // if queryparameter token is available, call the api
		auth.verify($routeParams.token)
			.success(function(data) {
				$scope.verifyStatus = "You are verified!!!Welcome to proFinder.";

			})
			.error(function(e) {
				$scope.verifyStatus = "Please check your email and verify account";
			});
	}


	$scope.onSubmit = function() {
		$scope.formError = "";
		if (!$scope.credentials.name || !$scope.credentials.email || !$scope.credentials.password) {
			$scope.formError = "All fields required. Try again!";
			return false;
		} else {
			/* Auth called*/
			auth
				.register($scope.credentials)
				.error(function(err) {
					$scope.formError = 'User already exists! Check email and verify.';
				})
				.then(function() {
					$scope.formError = "";
					$('#warning').html("<div class='alert alert-info'><strong>Verification needed!</strong> Verification link has been sent to this email : [" + $scope.credentials.email + "]</div>");
					$('input').val('');
				})
		}
	};
}