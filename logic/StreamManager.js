var https = require('https'),
    mongodb = require('mongoskin');

var StreamManager = function()  {
    this.clientId = process.env.EYEEM_CLIENTID;
    var db= mongodb.db(process.env.MONGOLAB_URI);
    this.col = db.collection("uis");
}


StreamManager.prototype.getStream = function(userId, cb) {

    var options = {
        host: 'eyeem.com',
        port: 443,
        path: '/api/v2/users/'+userId+'/photos?client_id=' + this.clientId,
        method: 'GET'
    };

    var req = https.request(options, function(res) {
        var data = "";
        res.on('data', function(d) {
            data += d;
        });
        res.on('end', function(d) {
            var dd = JSON.parse(data);
            cb(dd);
        })
    });
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}

exports.StreamManager = StreamManager;