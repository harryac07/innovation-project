var mongoose = require('mongoose');
var store = mongoose.model('Store');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


/* GET list of products */
module.exports.allStores = function(req, res) {
  store.find()
    .exec(function(err, store) {
      if (!store) {
        sendJSONresponse(res, 404, {
          "message": "Store not Found"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      sendJSONresponse(res, 200, store);
    });
};

/*POST products*/
module.exports.storesCreate = function(req, res) {
  store.create({
    name: req.body.name,
    address: req.body.address,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTime: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }],
    rating: req.body.rating,
    image: req.body.image,
    phone: req.body.phone
  }, function(err, store) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(store);
      sendJSONresponse(res, 201, store);
    }
  });
};

/* GET storesReadOne store/:storeid*/

module.exports.storesReadOne = function(req, res) {
  var storeId = req.params.storeid;
  if (!storeId) {
    sendJSONresponse(res, 404, {
      "message": "store id is required"
    });
    return;
  }
  store
    .findById(storeId)
    .exec(function(err, store) {
      if (!store) {
        sendJSONresponse(res, 404, {
          "message": "Store not found with that id"
        });
      } else if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        sendJSONresponse(res, 200, store);
      }
    });

};

/* PUT storesUpdateOne /store/:storeid */

module.exports.storesUpdateOne = function(req, res) {
  var storeId = req.params.storeid;
  if (!storeId) {
    sendJSONresponse(res, 404, {
      "message": "store id is required to update store"
    });
    return;
  }
  store
    .findById(storeId)
    .exec(function(err,store){
      if(!store){
        sendJSONresponse(res,404,{"message":"store not found to update"});
        return;
      }else if(err){
        sendJSONresponse(res,400,err);
        return;
      }
        store.name= req.body.name,
        store.address= req.body.address,
        store.coords= [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        store.openingTime= [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }],
        store.rating= req.body.rating,
        store.image= req.body.image,
        store.phone= req.body.phone 
      store.save(function(err,store){
        if(err){
          sendJSONresponse(res,400,err);
        }else{
          sendJSONresponse(res,200,store);
        }
      });     
    });
};

/* DELETE storesDeleteOne /store/:storeid*/

module.exports.storesDeleteOne=function(req,res){
  var storeId = req.params.storeid;
  if (!storeId) {
    sendJSONresponse(res, 404, {
      "message": "store id is required to remove store"
    });
    return;
  } 
  store
  .findByIdAndRemove(storeId)
  .exec(function(err,store){
    if(!store){
      sendJSONresponse(res,404,{"message":"Store not found with that id"});
      return;
    }else if(err){
      sendJSONresponse(res,400,err);
      return;
    }else{
      sendJSONresponse(res,204,null);
    }
  });
};




