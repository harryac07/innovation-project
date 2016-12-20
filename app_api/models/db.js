var mongoose = require( 'mongoose' );
require('./products');//requiring products collection
require('./stores');//requiring stores collection
require('./users');//requiring users collection

var gracefulShutdown;
//var dbURI = 'mongodb://localhost/product-finder';
var dbURI = 'mongodb://haria:saveearth@ds119508.mlab.com:19508/product-finder';



// if NODE_ENV=production nodemon is used for starting node to use heroku mongolab
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}


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