var https = require('https'),
    mongodb = require('mongoskin')
    ,und = require('underscore')
    ,tm = require("./TagManager");

var StreamManager = function(oa)  {
    var db = mongodb.db(process.env.MONGOLAB_URI);
    this.tagManager = new tm.TagManager;

    this.col = db.collection("uis");
    this.oa = oa;
};

/**
 * @return User object

 *
 */
StreamManager.prototype.getMe = function(accessToken, cb) {
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/me', accessToken,  function(err, res) {
        var result = JSON.parse(res);
        console.dir (result.user);
        cb(result.user);
    });
};

StreamManager.prototype.getStream = function(userId, accessToken, cb) {
    var self = this;
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/' + userId + '/photos', accessToken, function( error, result) {
        var jres = JSON.parse(result);
        self.augmentStream (jres.photos.items, cb);
    });

};

StreamManager.prototype.getFriendStream = function(userId, accessToken, cb) {
    var self = this;
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/users/' + userId + '/friendsPhotos', accessToken, function( error, result) {
        var jres = JSON.parse(result);
        self.augmentStream (jres.friendsPhotos.items, cb);
    });
};

StreamManager.prototype.getPhoto = function(photoId, accessToken, cb) {
    var self = this;
    this.oa.get(process.env.EYEEM_BASESITE + '/api/v2/photos/'+photoId, accessToken, function(error, result) {
        var result = JSON.parse(result);
        self.augmentPhoto(result.photo, function(photo) {
            var eyeemTags = photo.albums.items;
            photo.eyeemTags = eyeemTags;
            cb(photo);
        });
    });
};
/**
 * enhance the photo stream with tag information
 * callback is called with photos + tags
 * @param error
 * @param result
 * @param response
 */
StreamManager.prototype.augmentStream = function(photos, cb){

    var eyeemIds = und.pluck(photos, "id");
    var sEyeemIds = [];
    und.each(eyeemIds, function(eid) { //convert EyeEm Integer ids to String!
        sEyeemIds.push(eid+"");
    });

    this.tagManager.getTags(sEyeemIds, function (tags) {
        und.each(tags, function(tag) {

            var photo = und.find(photos, function(ph) {
                return (ph.id == tag.resId)
            });
            if (!photo.uisTags)
                photo.uisTags = [];

            photo.uisTags.push(tag);
        });
        cb(photos);
    });

};

StreamManager.prototype.augmentPhoto = function(photo, cb) {
    var pId = photo.id + "";
    var pIds = [pId];
    this.tagManager.getTags(pIds, function(tags) {
       photo.uisTags = tags;
        cb(photo);
    });
}
exports.StreamManager = StreamManager;