var express = require('express');
var router = express.Router();
var jwt =require('express-jwt');
var auth= jwt({ // setting up the authentication
	secret: process.env.JWT_SECRET,
	userProperty: 'payload' //define property on req to be payload
});

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var ctrlProducts = require('../controllers/products');
var ctrlStores = require('../controllers/stores');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');

// /*Stores*/

router.get('/store', ctrlStores.allStores);
router.post('/store', ctrlStores.storesCreate);
router.get('/store/:storeid', ctrlStores.storesReadOne);
router.put('/store/:storeid', ctrlStores.storesUpdateOne);
router.delete('/store/:storeid', ctrlStores.storesDeleteOne);

// /*Products*/

router.get('/product', ctrlProducts.allProducts);
router.get('/product/category/:categoryName',ctrlProducts.categoryProduct);
router.get('/product/search/:search',ctrlProducts.searchProduct);
router.post('/product/:storeid', ctrlProducts.productsCreate);
router.get('/product/:productid', ctrlProducts.productsReadOne); 
router.put('/product/:productid/:storeid', ctrlProducts.productsUpdateOne);
router.delete('/product/:productid', ctrlProducts.storesDeleteOne);

// /* USER routes */
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/verify/:token',ctrlAuth.verify);
router.get('/users',ctrlAuth.getUsers);

// /* Reviews */
router.post('/product/:productid/reviews',auth, ctrlReviews.reviewsCreate); // allow authenticated user only to post
router.get('/product/:productid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
// router.put('/product/:productid/reviews/reviewid', ctrlReviews.reviewsUpdateOne);
// router.delete('/product/:productid/reviews/reviewid', ctrlReviews.reviewsDeleteOne);

// /* Users */
// router.get('/register');


module.exports = router;
