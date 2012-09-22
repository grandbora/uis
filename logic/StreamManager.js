var https = require('https'),
    mongodb = require('mongoskin');

var StreamManager = function(oa)  {
    var db = mongodb.db(process.env.MONGOLAB_URI);
    this.col = db.collection("uis");
    this.oa = oa;
};

StreamManager.prototype.getMe = function(accessToken, cb) {
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/me', accessToken, parseApiResponse(cb));
};

StreamManager.prototype.getStream = function(userId, accessToken, cb) {
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/' + userId + '/photos', accessToken, parseApiResponse(cb));
};

StreamManager.prototype.getFriendStream = function(userId, accessToken, cb) {
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/' + userId + '/friendsPhotos', accessToken, parseApiResponse(cb));
};


var parseApiResponse = function(cb){
    return function(error, result, response){
        if (error) {
            console.log(error);
        }
        var result = JSON.parse(result);
        cb(result);
    };
};

exports.StreamManager = StreamManager;