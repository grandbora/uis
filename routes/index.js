
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
    this.streamManager = new sm.StreamManager();
}
StreamHandler.prototype.index = function(req, res){
  res.render('index', { title: 'Express' });
};


StreamHandler.prototype.stream = function(req, res) {

    this.streamManager.getStream(146292, function(data) {
        res.render('stream',{
            layout:true,
            locals:data
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

  console.log(oa._getAccessTokenUrl());
    oa.getOAuthAccessToken(req.query['code'],{
      grant_type:'authorization_code',
      redirect_uri:process.env.DOMAIN + '/login_callback'
    },function(nullValue, access_token, refresh_token, results){
      res.cookie('eyem_cookie', access_token);
      res.redirect('/stream')
    });
};

exports.StreamHandler = StreamHandler;