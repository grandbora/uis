var https = require('https'),
    mongodb = require('mongoskin');

var StreamManager = function(oa)  {
    var db = mongodb.db(process.env.MONGOLAB_URI);
    this.col = db.collection("uis");
    this.oa = oa;
}

StreamManager.prototype.getMe = function(accessToken, cb) {
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/me', accessToken, function(error, result, response){
        var result = JSON.parse(result);
        cb(result);
    });
}

StreamManager.prototype.getStream = function(userId, accessToken, cb) {

    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/' + userId + '/photos', accessToken, function(error, result, response){
        var result = JSON.parse(result);
        cb(result);
    });
}

exports.StreamManager = StreamManager;