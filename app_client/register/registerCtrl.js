angular
	.module('productFinder')
	.controller('registerCtrl', registerCtrl);


function registerCtrl($scope, $location, auth) { // service as parameter(auth-authentication)

	$scope.credentials = {
		name: "",
		email: "",
		password: ""
	};

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
					$scope.formError = 'User already exists!';
				})
				.then(function() {
					$location.url('/login');
				})
		}
	};
}