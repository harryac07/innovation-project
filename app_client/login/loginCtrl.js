angular
	.module('productFinder')
	.controller('loginCtrl', loginCtrl);


function loginCtrl($scope, $location, $window, auth) { // service as parameter

	$scope.credentials = {
		email: "",
		password: ""
	};

	$scope.onSubmit = function() {
		$scope.formError = "";
		if (!$scope.credentials.email || !$scope.credentials.password) {
			$scope.formError = "All fields required. Try again!";
			return false;
		} else {
			/* Auth called*/

			auth
				.login($scope.credentials)
				.error(function(err) {
					$scope.formError = 'Please enter valid email or password.';
				})
				.then(function() {
					$window.location.href = '/';
				})
		}
	};

}