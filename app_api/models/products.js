var mongoose = require('mongoose');

/* Schema for reviews */
var reviewSchema = new mongoose.Schema({
  author: {
  	type:String,
    required:true
  },
  rating: {type: Number,required:true,min: 0, max: 5},
  reviewText: {type:String},
  createdOn: {type: Date, "default": Date.now}
});

/*Image Schema*/
var imageSchema = new mongoose.Schema({
    kind: { 
        type: String, 
        enum: ['thumbnail', 'catalog', 'detail', 'zoom']
        // required: true
    },
    url: { type: String, required: true }
});

/*Sizes schema*/
var sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    imageDetail:[imageSchema],
    available: { type: Number, required: true, min: 0, max: 1000 },
    detail: { 
        type: String, 
        required: true, 
        validate: [/[a-zA-Z0-9]/, 'Product details should only have letters and numbers']
    },
    price: { type: Number, required: true, min: 0 }
});

/*Varient Schema*/
var varientSchema= new mongoose.Schema({
    color: String,
    sizeDetail: [sizeSchema]
});

/* Schema for product */
var productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
  store:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  brand:{type:String},
  image:String,
  review: [reviewSchema],
  category:String,
  varient:[varientSchema],
  manufactured:String,
  expiry:String,
  createdOn:{
    type:Date,
    default:Date.now
  }
	
});

/* complile the schema into a model */
module.exports =mongoose.model('Product', productSchema); //'modelname' , 'schema name'
