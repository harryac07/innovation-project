angular
	.module('productFinder')
	.controller('facebookCtrl', facebookCtrl);


function facebookCtrl($scope, $routeParams, $location, $window, auth) { // service as parameter
	auth.facebookLogin($routeParams.token);
	$window.location.href = '/';
}