var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* Register */
module.exports.register=function(req,res){
	if(!req.body.name || !req.body.email || !req.body.password){
		sendJSONresponse(res,400,{
			"message":"All fields required:"
		});
		return;
	}
	var user= new User(); // create a new user instances
	user.name=req.body.name;
	user.email=req.body.email;
	if(req.body.email==="harry_ac07@yahoo.com"){
		user.admin=true;
	}
	user.setPassword(req.body.password); // use setPassword method to set salt and hash

	user.save(function(err){
		var token;
		if(err){
			sendJSONresponse(res,400,err);
		}else{
			token=user.generateJwt(); // Generate JWT using schema method and send it to browser
			sendJSONresponse(res,200,{
				"token":token
			});
		}
	});

};

/* Login */
module.exports.login=function(req,res){
	if(!req.body.email || !req.body.password){
		sendJSONresponse(res,400,{
			"message":"All fields Required."
		});
		return;
	}
	passport.authenticate('local',function(err,user,info){
		var token;
		if(err){
			sendJSONresponse(res,400,err);
			return;
		}
		if(user){
			token=user.generateJwt();
			sendJSONresponse(res,200,{
				"token":token
			});
		}else{
			sendJSONresponse(res,401,info);
		}

	})(req,res); // make sure that req, res are available to the passport
};

/* GET users */
module.exports.getUsers=function(req,res){
  User
  	.find()
  	.exec(function(err,users){
  		if(err){
  			sendJSONresponse(res,400,err);
  		}else if(!users){
  			sendJSONresponse(res,404,{
  				"message":"User not Found"
  			});
  		}
  		sendJSONresponse(res,200,users);
  	});

};













