var request = require('request');
var cloudinary = require('cloudinary');


// Mongoose Model
var mongoose = require('mongoose');

var apiOptions = {
	server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = 'https://profinder1.herokuapp.com';
}

/* CLoudinary setup */
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});


/* GET 'homepage */

/* Home Page */

// module.exports.homepage = function(req, res) { // get all the products
// 	res.render('index', {
// 		title: 'Welcome to Home',
// 	});
// };


// /* Product by Category */

// var renderByCategory = function(req, res, responseBody) {
// 	res.render('categoryFind', {
// 		title: 'category find',
// 		product: responseBody
// 	});
// };
// module.exports.categoryFind = function(req, res) {
// 	var requestOptions, path;
// 	path = '/api/product/category/' + req.params.categoryName;
// 	requestOptions = {
// 		url: apiOptions.server + path,
// 		method: 'GET',
// 		json: {}

// 	};
// 	request(
// 		requestOptions,
// 		function(err, response, body) {
// 			renderByCategory(req, res, body);
// 		}
// 	);
// };

// /* Product by name in search field */

// var renderSearch = function(req, res, responseBody) {

// 	res.render('index', {
// 		title: 'searchfind',
// 		product: responseBody
// 	});
// };
// module.exports.searchFind = function(req, res) {
// 	var requestOptions, path;
// 	var search = req.query.search.toLowerCase();
// 	path = '/api/product/search/' + search;
// 	requestOptions = {
// 		url: apiOptions.server + path,
// 		method: 'GET',
// 		json: {}

// 	};
// 	request(
// 		requestOptions,
// 		function(err, response, body) {
// 			renderSearch(req, res, body);
// 		}
// 	);
// };

// /* Product detail */
// var renderProductDetail = function(req, res, responseBody) {
// 	res.render('productDetail', {
// 		title: "Poduct Info",
// 		terms: "It will be added soon or edited",
// 		product: responseBody
// 			// name:"Iphone 7",//product
// 			// brand:"Apple",
// 			// store:"12345",
// 			// image:"www.x.jpg",
// 			// author:"hari",
// 			// rating:5,
// 			// reviewText:"hello this is good phone",
// 			// category:"Phone",
// 			// color:"Green",
// 			// size:"5 inch",
// 			// available:200,
// 			// detail:"nice phone",
// 			// kind:"thumbnail",
// 			// url:"www.nicephone.jpg",
// 			// manufactured:"2015",
// 			// expiry:"2020"


// 	});
// 	console.log(responseBody);
// };
// module.exports.productDetail = function(req, res) {
// 	var requestOptions, path;
// 	path = '/api/product/' + req.params.productid;

// 	requestOptions = {
// 		url: apiOptions.server + path,
// 		method: 'GET',
// 		json: {}

// 	};
// 	request(
// 		requestOptions,
// 		function(err, response, body) {
// 			renderProductDetail(req, res, body);
// 		}
// 	);
// };

//  Login Page Controller 
// module.exports.login = function(req, res) {
// 	res.render('login', {
// 		title: 'Login'
// 	});
// };



// /* POST product */

// var renderByCategory = function(req, res, responseBody) {
// 	res.render('categoryFind', {
// 		title: 'category find',
// 		product: responseBody
// 	});
// };
// module.exports.categoryFind = function(req, res) {
// 	var requestOptions, path;
// 	path = '/api/product/category/' + req.params.categoryName;
// 	requestOptions = {
// 		url: apiOptions.server + path,
// 		method: 'GET',
// 		json: {}

// 	};
// 	request(
// 		requestOptions,
// 		function(err, response, body) {
// 			renderByCategory(req, res, body);
// 		}
// 	);
// };

/* Render Stores*/
var renderStores = function(req, res, responseBody) {
	res.render('post', {
		title: 'Post Product in store',
		store: responseBody
	});

};

module.exports.postProduct = function(req, res) {
	var requestOptions, path;
	path = '/api/store';
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		renderStores(req, res, body);
	});
};

//actual POST form data
module.exports.post = function(req, res) {
	cloudinary.uploader.upload(req.files.image.path, function(result) {
		console.log(result);


		var postdata = {
			name: req.body.name,
			brand: req.body.brand,
			store: req.body.store,
			image: result.url,
			category: req.body.category,
			color: req.body.color,
			size: req.body.size,
			available: req.body.available,
			detail: req.body.detail,
			price: req.body.price,
			url: req.body.url,
			manufactured: req.body.manufactured,
			expiry: req.body.expiry
		};
		path = '/api/product/' + req.body.store;
		//path = '/api/product/580e3c9e31275e040794d1f1';
		console.log('path : ' + path);
		requestOptions = {
			url: apiOptions.server + path,
			method: "POST",
			json: postdata
		};
		request(requestOptions, function(err, response, body) {
			if (response.statusCode === 201) {
				res.redirect('/');
				return;
			} else {
				res.send(err);
			}
		});
	});
};