var sm = require('../logic/StreamManager.js')
    , tm = require('../logic/TagManager.js')
    , am = require('../logic/ApiManager.js')
    , und = require("underscore")
    , oauth = require('oauth').OAuth2;

var oa = new oauth(
	process.env.EYEEM_CLIENTID,
	process.env.EYEEM_CLIENTSECRET,
	process.env.EYEEM_BASESITE,
	process.env.EYEEM_AUTHORIZEPATH,
	process.env.EYEEM_ACCESSTOKENPATH);

var StreamHandler = function() {
    this.streamManager = new sm.StreamManager(oa);
    this.tagManager = new tm.TagManager();
};

StreamHandler.prototype.index = function(req, res){
  res.render('index', {
      title: 'Express',
      friendstream:['a','b'],
      userstream:['uc','ud'],
      layout:false
  });
};

StreamHandler.prototype.main = function(req, res) {
    res.render('stream/main');
};

StreamHandler.prototype.stream = function(req, res) {

  var accessToken = req.cookies['eyem_cookie'];
 if (!accessToken) {
      res.render("login");
      return;
  }
  var self = this;

  self.streamManager.getMe(accessToken, function(result) {
    self.streamManager.getStream(result.user.id, accessToken, function(userPhotos) {
      self.streamManager.getFriendStream(result.user.id, accessToken, function(friendPhotos) {

        var eyemIds = und.pluck(userPhotos.photos.items, "id");
        self.tagManager.getTags(eyemIds, userPhotos.photos.items, function() {

          console.dir(userPhotos.photos.items);

          res.render('stream/main',{
            user: result.user,
            userPhotos:userPhotos,
            friendPhotos:friendPhotos,
            layout:true
          });
        });
      });
    });
  });
};

var TagHandler = function() {
    this.tagManager = new tm.TagManager();
    this.apiManager = new am.ApiManager();
};

TagHandler.prototype.addTag = function(req, res) {
    var tag = req.body;
    this.tagManager.addTag(tag);
    res.send(200,{result:'ok'});
};

TagHandler.prototype.fetchTagData = function(req, res) {
    var tagData = this.apiManager.fetchTagData({tagName:'nirvana'},{"latitude": 41.9135,"longitude": -87.622},function(result) {
      res.send(result);
    });
};

exports.login = function(req, res){
  var authorizeUrl = oa.getAuthorizeUrl({
        response_type:'code',
        redirect_uri:process.env.DOMAIN + '/login_callback'
    });
  res.redirect(authorizeUrl);
};

exports.loginCallback = function(req, res){

    oa.getOAuthAccessToken(req.query['code'],{
      grant_type:'authorization_code',
      redirect_uri:process.env.DOMAIN + '/login_callback'
    },function(error, access_token, refresh_token, results){
        console.dir(access_token);
      res.cookie('eyem_cookie', access_token);
      res.redirect('/stream');
    });
};

exports.StreamHandler = StreamHandler;
exports.TagHandler = TagHandler;