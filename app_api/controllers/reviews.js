var mongoose = require('mongoose');
var product = mongoose.model('Product');
 var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

/*GET /product/:productid/reviews/reviewid - specific review*/
module.exports.reviewsReadOne = function(req, res) {
	if (req.params && req.params.productid && req.params.reviewid) {
		product.findById(req.params.productid)
			.select('name review') // use select method to query model
			.exec(function(err, product) {
				var response, review;
				if (!product) {
					sendJSONresponse(res, 404, {
						"message": "productid not found!"
					});
					return;
				} else if (err) {
					sendJSONresponse(res, 400, err);
					return;
				}
				//
				if (product.review && product.review.length > 0) {
					var review = product.review.id(req.params.reviewid); // mongoose subdement.id method for searching matching id
					if (!review) { // if review not found
						sendJSONresponse(res, 404, {
							"message": "review id not found."
						});
					} else {
						response = { //if review found, build response object for review and product
							product: {
								name: product.name,
								id: req.params.productid
							},
							review: review
						};
						sendJSONresponse(res, 200, response);
					}
				} else {
					sendJSONresponse(res, 404, {
						"message": "no reviews found!"
					});
				}

			});
	} else {
		sendJSONresponse(res, 404, {
			"message": "productid and reviewid both are required."
		});
	}

};

/*POST /product/:productid/reviews review*/

/*
	-Find the correct parent document.
	-Add a new subdocument.
	-Save the parent document.
*/

var doAddReview = function(req, res, product) {
	if (!product) {
		sendJSONresponse(res, 404, {
			"message": "product id not found!"
		});
	} else {
		product.review.push({ // put new data in subdocument array
			author: req.body.author,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});
		product.save(function(err, product) {
			var thisReview;
			if (err) {
				sendJSONresponse(res, 400, err);
			} else {
				updateAverageRating(product._id); // on successful save operation call this to update average rating
				thisReview = product.review[product.review.length - 1];
				sendJSONresponse(res, 201, thisReview);
			}
		});
	}
};

//updateAverageRating here
var updateAverageRating = function(productid) {
	product
		.findById(productid)
		.select('rating review')
		.exec(function(err, product) {
			if (!err) {
				doSetAverageRating(product); // set average rating 
			}
		});
};
var doSetAverageRating = function(product) {
	var i, reviewCount, ratingAverage, ratingTotal;
	if (product.review && product.review.length > 0) {
		reviewCount = product.review.length;

		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + product.review[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10); // calculate average rating
		product.rating = ratingAverage; // update rating
		product.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('Updated average rating: ' + ratingAverage);
			}
		});
	}
};

module.exports.reviewsCreate = function(req, res) {
	getAuthor(req, res, function(req, res,userName) { // call getAuthor function and pass user's name in callback
		if (req.params.productid) {
			product.findById(req.params.productid)
				.select('review')
				.exec(function(err, product) {
					if (err) {
						sendJSONresponse(res, 400, err);
					} else {
						doAddReview(req, res, product,userName); // call this operation to add review & pass userName into this function
					}
				});
		} else {
			sendJSONresponse(res, 404, {
				"message": "product id is required"
			});
		}
	});
};

var getAuthor=function(req,res,callback){
	if(req.payload && req.payload.email){ // ensure the user model is available
		User.findOne({email:req.payload.email})
		.exec(function(err,user){
			if(!user){
				sendJSONresponse(res,404,{
					"message":"User not found!"
				});
				return;
			}else if(err){
				sendJSONresponse(res,400,err);
				return;
			}
			callback(req,res,user.name); // run callback passing user's name
		});
	}else{
		sendJSONresponse(res,404,{
			"message":"USer not found!"
		});
		return;
	}
};
















