
/*
 * GET home page.
 */

var sm = require('../logic/StreamManager.js');

var StreamHandler = function() {
    this.streamManager = new sm.StreamManager();
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

    this.streamManager.getStream(146292, function(data) {
        res.render('stream',{
            layout:true,
            locals:data
        });
    });
};

exports.StreamHandler = StreamHandler;

