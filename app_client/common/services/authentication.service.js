angular
	.module('productFinder')
	.service('auth', auth);


function auth($http, $window,$location) {

	var saveToken = function(token) {
		$window.localStorage['user-token'] = token;
	};
	var getToken = function() {
		return $window.localStorage['user-token'];
	};
	var isLoggedIn = function() {
		var token = getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};
	var currentUser = function() {
		if (isLoggedIn()) {
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				email: payload.email,
				name: payload.name,
				admin: payload.admin
			};
		}
	};
	register = function(user) {
		return $http.post('/api/register', user).success(function(data) {
			// saveToken(data.token);
		});
	};

	login = function(user) {
		return $http.post('/api/login', user).success(function(data) {
			saveToken(data.token);
		});
	};

	logout = function() {
		$window.localStorage.removeItem('user-token');
	};

	return {
		currentUser: currentUser,
		saveToken: saveToken,
		getToken: getToken,
		isLoggedIn: isLoggedIn,
		register: register,
		login: login,
		logout: logout
	};

}