var cloudinary = require('cloudinary');
/* CLoudinary setup */
cloudinary.config({
	cloud_name: 'haria',
	api_key: '114523583929527',
	api_secret: 'qq_hgWwFvd2Bcst4futLR2oVSYo'
});

module.exports.angularApp = function(req, res) {
	cloudinary.api.resources(function(items) {
		res.render('layout', {
			images: items.resources,
			title: 'Welcome to Home',
			cloudinary: cloudinary
		});
	});
};