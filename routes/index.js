
/*
 * GET home page.
 */

var sm = require('../logic/StreamManager.js')
    , tm = require('../logic/TagManager.js')
    , und = require("underscore")
    , oauth = require('oauth').OAuth2;

var oa = new oauth(
	process.env.EYEEM_CLIENTID,
	process.env.EYEEM_CLIENTSECRET,
	process.env.EYEEM_BASESITE,
	process.env.EYEEM_AUTHORIZEPATH,
	process.env.EYEEM_ACCESSTOKENPATH);

var StreamHandler = function() {
    this.streamManager = new sm.StreamManager();
    this.tagManager = new tm.TagManager();

}
StreamHandler.prototype.index = function(req, res){
  res.render('index', { title: 'Express' });
};

StreamHandler.prototype.stream = function(req, res) {
    var userId = req.params.userId;
    var self = this;

    this.streamManager.getStream(userId, function(data) {
        var eyemIds = und.pluck(data.photos.items, "id");
        self.tagManager.getTags(eyemIds, data.photos.items, function() {
            console.dir(data.photos.items);
            res.render('stream',{
                layout:true,
                locals:data
            });
        })
    });
};

StreamHandler.prototype.main = function(req, res) {
    res.render('stream/main', {

    });
}

var TagHandler = function() {
    this.tagManager = new tm.TagManager();
};

TagHandler.prototype.addTag = function(req, res) {
    var tag = req.body;
    this.tagManager.addTag(tag);
    res.send(200,{result:'ok'});
};

exports.login = function(req, res){
var authorizeUrl = oa.getAuthorizeUrl({
        response_type:'code',
        redirect_uri:process.env.DOMAIN + '/login_callback'
    });
 res.redirect(authorizeUrl);
};

exports.loginCallback = function(req, res){

  console.log(oa._getAccessTokenUrl());
    oa.getOAuthAccessToken(req.query['code'],{
      grant_type:'authorization_code',
      redirect_uri:process.env.DOMAIN + '/login_callback'
    },function(error, access_token, refresh_token, results){
        console.dir(access_token);
      res.cookie('eyem_cookie', access_token);
      res.redirect('/stream')
    });
};

exports.StreamHandler = StreamHandler;
exports.TagHandler = TagHandler;
