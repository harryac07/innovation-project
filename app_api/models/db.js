var mongoose = require( 'mongoose' );
require('./products');//requiring products collection
require('./stores');//requiring stores collection
require('./users');//requiring users collection

var gracefulShutdown;
//var dbURI = 'mongodb://localhost/product-finder';
var dbURI = process.env.DATABASE; // store in dotenv
mongoose.connect(dbURI);

mongoose.connection.on('connected',function(){
	console.log('Mongoose connected to '+dbURI);
});
mongoose.connection.on('error',function(err){
	console.log('Mongoose connection error:  '+err);
});
mongoose.connection.on('disconnected',function(){
	console.log('Mongoose disconnected  '+dbURI);
});

//for shutdown events

gracefulShutdown=function(msg,callback){
	mongoose.connection.close(function(){
		console.log("Mongoose disconnected through "+msg);
		callback();
	});
};

//For nodemon restarts
process.once('SIGUSR2',function(){
	gracefulShutdown('nodemon restart',function(){
		process.kill(process.pid,'SIGUSR2');
	});
});

//For app termination
process.once('SIGINT',function(){
	gracefulShutdown('app termination',function(){
		process.exit(0);
	});
});
//For heroku app termination
process.once('SIGTERM',function(){
	gracefulShutdown('Heroku app Shutdown',function(){
		process.exit(0);
	});
});