var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cloudinary = require('cloudinary')  
  , fs = require('fs');
  
var ctrlOthers = require('../controllers/others');
var ctrlHomepage=require('../controllers/main');

/* Locations pages */
router.get('/', ctrlOthers.angularApp);
// router.get('/login',ctrlHomepage.login);
// router.get('/product/category/:categoryName',ctrlHomepage.categoryFind);
// router.get('/product/search',ctrlHomepage.searchFind);
// router.get('/product/:productid' , ctrlHomepage.productDetail);

/* Add product only in express . others in angular js */
 router.get('/post',ctrlHomepage.postProduct);
 router.post('/post',multipartMiddleware,ctrlHomepage.post); // actual post


module.exports = router;
