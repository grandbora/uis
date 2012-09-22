
/*
 * GET home page.
 */

var mongodb = require('mongoskin');

var StreamHandler = function() {
    var db= mongodb.db(process.env.MONGOLAB_URI);
    this.col = db.collection("uis");
}
StreamHandler.prototype.index = function(req, res){
  res.render('index', { title: 'Express' });
};

StreamHandler.prototype.tagsIndex = function(req, res) {
  this.col.findOne({type:'t'}, function(err, doc) {
        res.send(doc);
  });

};

StreamHandler.prototype.stream = function(req, res) {
    res.send("done");
};

exports.StreamHandler = StreamHandler;

