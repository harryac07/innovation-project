var mongoose = require('mongoose');
var product= require('./products');

/* Schema for opening time */
var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var storeSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	address:{
		type:String,
		required:true
	},
	coords: {
		type: [Number],
		index: '2dsphere',
		required: true //'2dsphere' enables MongoDB to do the correct calculations when running queries
	},
	rating: {
		type: Number,
		"default": 0,
		min: 0,
		max: 5
	},
	image:{
		type:String,
		required:true
	},
	openingTime:[openingTimeSchema],
	phone:String

});

/* complile the schema into a model */
mongoose.model('Store', storeSchema); //'modelname' , 'schema name'



