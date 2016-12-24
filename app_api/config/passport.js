var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load the auth variables
var configAuth = require('./auth');

var mongoose = require('mongoose');
var User = mongoose.model('User');

// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	User.findById(_id, function(err, user) {
		done(err, user);
	});
});

/* for local passport */
passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function(username, password, done) {
		User.findOne({
			email: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					"message": "Incorrect Username."
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					"message": "Incorrect Password." + password
				});
			}
			return done(null, user);

		});
	}
));

/* facebook auth */
passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true,
		profileFields: ['id', 'name', 'emails']

	},
	// facebook will send back the token and profile
	function(req, token, refreshToken, profile, done) {

		User.findOne({
			'email': profile.emails[0].value
		}, function(err, user) {
			if (err) {
				console.log('her is error');
				return done(err);

			}

			if (user) {

				return done(null, user);

			} else {
				// if there is no user, create them
				var newUser = new User();

				newUser.verifyToken = token;
				newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
				newUser.email = (profile.emails[0].value || '').toLowerCase();
				newUser.verified = true; // verified true if signup using facebook
				//create a random salt and hash (not in use though)
				newUser.setPassword((token + profile.emails[0].value + Math.random()).toString()); // use setPassword method to set salt and hash
				newUser.account = 'facebook';

				newUser.save(function(err) {
					if (err) {
						console.log('here is error');
						return done(err);
					}

					return done(null, newUser);
				});
			}
		});


	}));