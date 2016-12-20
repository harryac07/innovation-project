angular
	.module('productFinder')
	.service('productData', productData);


function productData($http, auth) {
	var productList = function() {
		return $http.get('/api/product');
	};

	var productById = function(productid) {
		console.log('productid: ' + productid);
		return $http.get('/api/product/' + productid);
	};

	var productByCategory = function(categoryName) {
		console.log('categoryName : ' + categoryName);
		return $http.get('/api/product/category/' + categoryName);
	};

	var productSearch = function(queryKey) {
		return $http.get('/api/product/search/' + queryKey);
	};

	var postproduct = function(storeid, data) { // to be built /product/:storeid
		return $http.post('/api/product/' + storeid, data, {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		});
	};

	var addReviewById = function(productid, data) {
		return $http.post('/api/product/' + productid + '/reviews', data, {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		});
	};
	var storeDetail = function(storeid) {
		return $http.get('/api/store/' + storeid);
	};

	return {
		productList: productList,
		productById: productById,
		productByCategory: productByCategory,
		productSearch: productSearch,
		addReviewById: addReviewById,
		postproduct: postproduct,
		storeDetail:storeDetail
	};
}