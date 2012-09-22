
/*
 * GET home page.
 */

var sm = require('../logic/StreamManager.js');
var oauth = require('oauth').OAuth2;

var oa = new oauth(
	process.env.EYEEM_CLIENTID,
	process.env.EYEEM_CLIENTSECRET,
	process.env.EYEEM_BASESITE,
	process.env.EYEEM_AUTHORIZEPATH,
	process.env.EYEEM_ACCESSTOKENPATH);

var StreamHandler = function() {
    this.streamManager = new sm.StreamManager(oa);
};

StreamHandler.prototype.index = function(req, res){
  res.render('index', { title: 'Express' });
};

StreamHandler.prototype.main = function(req, res) {
    res.render('stream/main');
};

StreamHandler.prototype.stream = function(req, res) {

  var self = this;
  self.streamManager.getMe(req.cookies['eyem_cookie'], function(result) {
    self.streamManager.getStream(result.user.id, req.cookies['eyem_cookie'], function(userPhotos) {
      self.streamManager.getFriendStream(result.user.id, req.cookies['eyem_cookie'], function(friendPhotos) {


        console.log(userPhotos.photos.items);

        console.log({
          userPhotos:userPhotos,
          user:result.user,
          friendPhotos:friendPhotos
        });

        // app.render('stream/stream', {
        //   layout:true,
        //   locals:{
        //     user:result.user,
        //     userPhotos:userPhotos,
        //     friendPhotos:friendPhotos
        //   }
        // }, function(err, html){
        //     res.send(htm);
        // });
        // return;

        res.render('stream/main',{
          layout:true,
          locals:{
            user:result.user,
            userPhotos:userPhotos,
            friendPhotos:friendPhotos
          }
        });



      });
    });
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
