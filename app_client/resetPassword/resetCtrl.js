angular
	.module('productFinder')
	.controller('resetCtrl', resetCtrl);


function resetCtrl($scope,$routeParams, $location, $window, auth) { // service as parameter
	$scope.credentials = {
		email: ""
	};
	$scope.formError = "";
	$scope.onSubmit = function() {
		if (!$scope.credentials.email) {
			$scope.formError = "Please enter a valid email";
			return false;
		} else {
			auth
				.resetPassword($scope.credentials).success(function(data) {
					$scope.formError = "Reset link has been sent. Please check your email!";
					$('#email').val('');
				})
				.error(function(err) {
					$scope.formError = err;
				});
		}
	};

	$scope.credential={
		email:"",
		password:""
	};
	/* password change form for resetPassword */
	$scope.submit = function() {
		if (!$scope.credential.email || !$scope.credential.password) {
			$scope.formError = "All fields required!";
			return false;
		} else {
			auth
				.changePassword($routeParams.token, $scope.credential).success(function(data) {

				})
				.error(function(err) {
					$scope.formError = err;
				});
		}
	};

}