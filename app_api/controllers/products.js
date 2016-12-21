// cloudinary
var cloudinary = require('cloudinary');

var mongoose = require('mongoose');
var product = mongoose.model('Product');
var User = mongoose.model('User');
/* for nodemoailer login confirmation */
var nodemailer = require('nodemailer');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

/*POST products*/
module.exports.productsCreate = function(req, res) {

	if (!req.params.storeid) {
		sendJSONresponse(res, 404, {
			"message": "store id is required to post product"
		});
		return;
	}
	product.create({
		name: req.body.name,
		brand: req.body.brand,
		store: req.params.storeid,
		image: req.body.image,
		// review: [{
		// 	author: req.body.author,
		// 	rating: req.body.rating,
		// 	reviewText: req.body.reviewText
		// }],
		category: req.body.category,
		varient: [{
			color: req.body.color,
			sizeDetail: [{
				size: req.body.size,
				available: req.body.available,
				detail: req.body.detail,
				price: req.body.price,
				imageDetail: [{
					kind: req.body.kind,
					url: req.body.url
				}]
			}]
		}],
		manufactured: req.body.manufactured,
		expiry: req.body.expiry
	}, function(err, product) {
		if (err) {
			console.log(err);
			sendJSONresponse(res, 400, err);
		} else {
			console.log(product);
			sendJSONresponse(res, 201, product);
			// get all the users to select emails for sending emails
			User
				.find()
				.select('email -_id')
				.exec(function(err, users) {
					if (err) {
						sendJSONresponse(res, 400, err);
					} else if (!users) {
						sendJSONresponse(res, 404, {
							"message": "User not Found"
						});
					}

					/* /* Notify user when product is updated in system */

					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
							user: 'harryac007@gmail.com', // your email here
							pass: process.env.EMAIL_SECRET // your password here
						}
					});
					var maillist = [];
					for (key in users) {
						if (users.hasOwnProperty(key)) {
							var value = users[key];
							maillist.push(value['email']);
							//do something with value;
						}
					}
					console.log('mailist ' + maillist);
					maillist.forEach(function(to, i, array) {
						var text = "<p>Hello,<br><br>New products have been added to the proFinder app now. Here are basic product details.<br><br>Product name: " + req.body.name + "<br>Product Brand: " + req.body.brand + "<br>Product Details: " + req.body.detail + " <br><br><br>All of our products are valuable, you may miss the offers. For more informations, Please visit our site:<a href=''>Visit proFinder</a><br><br>Profinder Team</p>";
						var mailOptions = {
							from: 'harryac007@gmail.com', // sender address
							subject: 'Welcome to ProFinder', // Subject line
							html: text
								// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
						};
						mailOptions.to = to;

						transporter.sendMail(mailOptions, function(err, info) {
							if (err) {
								console.log(err);
								return;
							} else if (!info) {
								sendJSONresponse(res, 404, {
									"message": "not found email."
								});
								return;
							} else {
								console.log('Message sent: ' + info);
								//sendJSONresponse(res, 200, info);

							}
						});
					});

				});
		}
	});

};

/* GET list of products */
module.exports.allProducts = function(req, res) {
	product.find()
		.populate('store', 'name address coords') // select name and address from store
		// .limit(6)
		// .sort({ // sort will be by distance later
		//       	name: 'asc'
		//   	})
		.exec(function(err, product) {
			if (!product) {
				sendJSONresponse(res, 404, {
					"message": "Store not Found"
				});
				return;
			} else if (err) {
				sendJSONresponse(res, 400, err);
				return;
			}
			sendJSONresponse(res, 200, product);
		});
	return;
};

/* GET product by category */
module.exports.categoryProduct = function(req, res) {
	var query = req.params.categoryName;
	if (query && query.length > 0) {
		product.find({
				"category": new RegExp(query, 'i')
			})
			.populate('store', 'name address coords') // select name and address from store
			.exec(function(err, product) {
				if (!product) {
					sendJSONresponse(res, 404, {
						"message": "Store not Found"
					});
					return;
				} else if (err) {
					sendJSONresponse(res, 400, err);
					return;
				}
				sendJSONresponse(res, 200, product);
			});
		return;
	} else {
		sendJSONresponse(res, 404, {
			"message": "query parameter required"
		});
	}
};

/* GET product by search in search input */
module.exports.searchProduct = function(req, res) {
	var query = req.params.search;
	if (query && query.length > 0) {
		product.find({
				$or: [{
						"name": new RegExp(query, 'i')
					}, {
						"brand": new RegExp(query, 'i')
					}] // match starting or ending
			})
			.populate('store', 'name address coords') // select name and address from store
			.exec(function(err, product) {
				if (!product) {
					sendJSONresponse(res, 404, {
						"message": "Store not Found"
					});
					return;
				} else if (err) {
					sendJSONresponse(res, 400, err);
					return;
				}
				sendJSONresponse(res, 200, product);
			});
		console.log(query);
		return;
	} else {
		sendJSONresponse(res, 404, {
			"message": "query parameter required"
		});
	}
};


/* GET /product/:productid */
module.exports.productsReadOne = function(req, res) {
	var productId = req.params.productid;
	if (!productId) {
		sendJSONresponse(res, 404, {
			"message": "product id required"
		});
		return;
	}
	product.
	findById(productId)
		.populate('store', 'name address coords rating') // select name and address from store
		.exec(function(err, product) {
			if (!product) {
				sendJSONresponse(res, 404, {
					"message": "Product not Found with that id"
				});
			} else if (err) {
				sendJSONresponse(res, 400, err);
			} else {
				sendJSONresponse(res, 200, product);
			}
		});
};


/* PUT /product/:productid productsUpdateOne */

module.exports.productsUpdateOne = function(req, res) {
	var productId = req.params.productid;
	var storeId = req.params.storeid;
	if (!productId && !storeId) {
		sendJSONresponse(res, 404, {
			"message": "Productid and Storeid is required"
		});
		return;
	}
	product
		.findById(productId)
		.exec(function(err, product) {
			product.name = req.body.name,
				product.brand = req.body.brand,
				product.store = req.params.storeid,
				product.image = req.body.image,
				product.review = [{
					author: req.body.author,
					rating: req.body.rating,
					reviewText: req.body.reviewText
				}],
				product.category = req.body.category,
				product.varient = [{
					color: req.body.color,
					sizeDetail: [{
						size: req.body.size,
						available: req.body.available,
						detail: req.body.detail,
						price: req.body.price,
						imageDetail: [{
							kind: req.body.kind,
							url: req.body.url
						}]
					}]
				}],
				product.manufactured = req.body.manufactured,
				product.expiry = req.body.expiry

			product.save(function(err, product) {
				if (err) {
					sendJSONresponse(res, 400, err);
				} else {
					sendJSONresponse(res, 200, product);
				}
			});
		});
};

/* DELETE /product/:productid */

module.exports.storesDeleteOne = function(req, res) {
	var productId = req.params.productid;
	if (!productId) {
		sendJSONresponse(res, 404, {
			"message": "product id is required to remove product"
		});
		return;
	}
	product
		.findByIdAndRemove(productId)
		.exec(function(err, product) {
			if (!product) {
				sendJSONresponse(res, 404, {
					"message": "Product not found with that id"
				});
				return;
			} else if (err) {
				sendJSONresponse(res, 400, err);
				return;
			} else {
				sendJSONresponse(res, 204, null);
			}
		});
};