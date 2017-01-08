var cloudinary = require('cloudinary');

module.exports.angularApp = function(req, res) {
	cloudinary.api.resources(function(items) {
		res.render('layout', {
			images: items.resources,
			title: 'Welcome to Home',
			cloudinary: cloudinary
		});
	});
};