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
		if (!$scope.credential.password || !$scope.confirmPassword) {
			$scope.formError = "All fields required!";
			return false;
		} else if (!($scope.credential.password === $scope.confirmPassword)) {
			$scope.passwordError = "Password mismatched. retype!";
			return false;
		} else {
			auth
				.changePassword($routeParams.token, $scope.credential)
				.error(function(err) {
					$scope.formError = err;
					$scope.resendLink=true;
				}).then(function() {
					$window.location.href = "/#/resetpassword";
				});
		}
	};

}