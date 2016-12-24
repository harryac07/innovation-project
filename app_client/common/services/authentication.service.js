angular
	.module('productFinder')
	.service('auth', auth);


function auth($http, $window, $location) {

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
				admin: payload.admin,
				verified: payload.verified
			};
		}
	};
	register = function(user) {
		return $http.post('/api/register', user).success(function(data) {
			// saveToken(data.token);
		});
	};
	var verify = function(token) {
		return $http.get('/api/verify/' + token);
	};

	login = function(user) {
		return $http.post('/api/login', user).success(function(data) {

			saveToken(data.token);
		});
	};

	logout = function() {
		$window.localStorage.removeItem('user-token');
	};
	facebookLogin = function(token) {// save the token when logged in with facebook
		saveToken(token);

	};

	return {
		currentUser: currentUser,
		saveToken: saveToken,
		getToken: getToken,
		isLoggedIn: isLoggedIn,
		register: register,
		verify: verify,
		login: login,
		logout: logout,
		facebookLogin: facebookLogin
	};

}