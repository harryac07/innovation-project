angular
	.module('productFinder', ['ngRoute', 'ngSanitize'])
	.config(['$routeProvider', config]);

function config($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'productList/home.html',
			controller: 'homeCtrl'

		})
		.when('/product/:productid', {
			templateUrl: 'productDetail/details.html',
			controller: 'productDetailCtrl'
		})
		.when('/product/category/:categoryName', {
			templateUrl: 'productList/home.html',
			controller: 'categoryCtrl'
		})
		.when('/product/search/:search', {
			templateUrl: 'productList/home.html',
			controller: 'searchCtrl'

		})
		.when('/register', {
			templateUrl: 'register/register.html',
			controller: 'registerCtrl'
		})
		.when('/verify/:token', {
			templateUrl: 'register/verify.html',
			controller: 'registerCtrl'
		})
		.when('/reset', {
			templateUrl: 'resetPassword/reset.html',
			controller: 'resetCtrl'
		})
		.when('/resetpassword/:token', {
			templateUrl: 'resetPassword/resetpassword.html',
			controller: 'resetpasswordCtrl'
		})
		.when('/resetpassword', {
			templateUrl: 'resetPassword/resetSuccess.html',
			controller: 'resetpasswordCtrl'
		})
		.when('/login', {
			templateUrl: 'login/login.html',
			controller: 'loginCtrl'
		})
		.when('/facebook/:token', {
			templateUrl: 'social/facebook.html',
			controller: 'facebookCtrl'
		})
		.when('/postproduct/:storeid', {
			templateUrl: 'post/postproduct.html',
			controller: 'postproductCtrl'
		})
		.when('/store/:storeid', {
			templateUrl: 'store/store.html',
			controller: 'storeDetailCtrl'
		})
		.when('/about', {
			templateUrl: 'about/about.html',
			controller: 'aboutCtrl'
		})
		.otherwise({
			redirectTo: '/'
		})
}