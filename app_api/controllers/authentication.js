var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
/* for nodemoailer login confirmation */
var nodemailer = require('nodemailer');
var host;
var randomToken;
var mailOptions;
var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

/* Register */
module.exports.register = function(req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required:"
		});
		return;
	}
	var user = new User(); // create a new user instances
	host=req.get('host');// get host
	user.name = req.body.name;
	user.email = req.body.email;
	if (req.body.email === "harry_ac07@yahoo.com") {
		user.admin = true;
	}
	user.setPassword(req.body.password); // use setPassword method to set salt and hash

	user.save(function(err) {
		var token;
		if (err) {
			sendJSONresponse(res, 400, err);
			return;
		} else {
			token = user.generateJwt(); // Generate JWT using schema method and send it to browser
			randomToken=token;
			sendJSONresponse(res, 200, {
				"token": token
			});
		}
	});
	/* When user is registered, greet him to welcome */
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'harryac007@gmail.com', // your email here
			pass: process.env.EMAIL_SECRET // your password here
		}
	});
	var text = 'Hello '+req.body.name+ '\n\nWelcome to Profinder. Now you are permitted to grab everything from our app.\n\n' + 'Profinder Team';

	//var text = 'Hello ' + req.body.name+',\n\n'+'Welcome to ProFinder. You can check all the products you want to buy and get more infos on it. \n\n\nProFinder Team.';
	mailOptions = {
		from: 'harryac007@gmail.com', // sender address
		to: req.body.email, // list of receivers
		subject: 'Welcome to ProFinder', // Subject line
		text: text
			// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
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

}; /* register ends here */

/* user verification */
// module.exports.verify = function(req, res) {
// 	if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
// 		console.log("Domain is matched. Information is from Authentic email");
// 		if (req.query.id == randomToken) {
// 			console.log("email is verified");
// 			res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
// 		} else {
// 			console.log("email is not verified");
// 			res.end("<h1>Bad Request</h1>");
// 		}
// 	} else {
// 		res.end("<h1>Request is from unknown source");
// 	}
// };

/* Login */
module.exports.login = function(req, res) {
	if (!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields Required."
		});
		return;
	}

	passport.authenticate('local', function(err, user, info) {
		var token;
		if (err) {
			sendJSONresponse(res, 400, err);
			return;
		}

		if (user) {
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				"token": token
			});
		} else {
			sendJSONresponse(res, 401, info);
		}

	})(req, res); // make sure that req, res are available to the passport

};

/* GET users */
module.exports.getUsers = function(req, res) {
	User
		.find()
		.exec(function(err, users) {
			if (err) {
				sendJSONresponse(res, 400, err);
			} else if (!users) {
				sendJSONresponse(res, 404, {
					"message": "User not Found"
				});
			}
			sendJSONresponse(res, 200, users);
		});

};