var https = require('https'),
    mongodb = require('mongoskin'),
    und = require('underscore');

var TagManager = function()  {

    var db= mongodb.db(process.env.MONGOLAB_URI);
    this.col = db.collection("uis");

}

/**
 * { resId: '822356',
  x: '448',
  y: '358',
  tagname: 'test',
  category: 'beverage' }
 */
TagManager.prototype.addTag = function(tag) {
    this.col.save(tag, function(err) {

    });
};

TagManager.prototype.getTags = function(ids, cb) {
    this.col.find({resType:'ee-photo', resId: {$in: ids}}).toArray(function(err, tags) {
        //console.dir(tags);
        cb(tags);
    });
}

exports.TagManager = TagManager;