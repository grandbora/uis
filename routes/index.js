
/*
 * GET home page.
 */

var MNG = require('mongodb');

var MONGO = {
    host: 'ds037907.mongolab.com',
    port:37907,
    opts: {},
    dbname: 'heroku_app7810183',
    user: 'heroku_app7810183',
    pass: 'qmoact0ipl86o21hl39sdabub8'

};



exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.tagsIndex = function(req, res) {


  var db = new MNG.Db(MONGO.dbname,
      new MNG.Server(MONGO.host, MONGO.port,  MONGO.opts), {native_parser: false});

    db.open(function(err, db) {
        //assert.equal(null, err);
        console.log("connected");
        console.dir(err);

        db.authenticate(MONGO.user, MONGO.pass, function(err, result) {
            console.dir(err);

            var collection = db.collection("uis");
            collection.findOne({type:'t'}, function(err, doc) {
                res.send(doc);

            });

        });

    });

};