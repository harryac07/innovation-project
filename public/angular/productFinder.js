
// angular.module("productFinder", []);

var detailList = function($scope, productData) {
	$scope.message='Message';
	productData
		.success(function(data){
			$scope.data = { products : data}
		})
		.error(function(e){
			console.log(e);
		});
};


var productData = function($http){
	return $http.get('/api/product');
};

// angular
// 	.module('productFinder')
// 	.controller('detailList', detailList)
// 	.service('productData', productData);