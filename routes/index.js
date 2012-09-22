
/*
 * GET home page.
 */

var mongodb = require('mongoskin');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.tagsIndex = function(req, res) {

  var db= mongodb.db(process.env.MONGOLAB_URI);
  var col = db.collection("uis");

  col.findOne({type:'t'}, function(err, doc) {
        res.send(doc);
  });


};