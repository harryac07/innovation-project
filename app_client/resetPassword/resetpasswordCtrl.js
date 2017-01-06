angular
	.module('productFinder')
	.controller('resetpasswordCtrl', resetpasswordCtrl);


function resetpasswordCtrl($scope, $routeParams, $location, $window, auth) { // service as parameter

	$scope.credential = {
		email: "",
		password: ""
	};

	/* password change form for resetPassword */
	$scope.onSubmit = function() {
		if (!$scope.credential.email || !$scope.credential.password) {
			$scope.formError = "All fields required!";
			return false;
		} else if (!($scope.credential.password === $scope.confirmPassword)) {
			$scope.passwordError = "retype password!";
			return false;
		} else {
			auth
				.changePassword($routeParams.token, $scope.credential).success(function(data) {
					console.log('success');
				})
				.error(function(err) {
					$scope.formError = err;
				}).then(function() {
					$window.location.href = "/#/login";
				});
		}
	};

}