
/*
 * GET home page.
 */

var mongodb = require('mongoskin');
var oauth = require('oauth').OAuth2;
var oa = new oauth(
	process.env.EYEEM_CLIENTID,
	process.env.EYEEM_CLIENTSECRET,
	process.env.EYEEM_BASESITE,
	process.env.EYEEM_AUTHORIZEPATH,
	process.env.EYEEM_ACCESSTOKENPATH);

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
	var authorizeUrl = oa.getAuthorizeUrl({
		response_type:'code',
		redirect_uri:process.env.DOMAIN + '/login_callback'
	});
	res.redirect(authorizeUrl);
};

exports.loginCallback = function(req, res){
	res.cookie('eyem_cookie', req.query['code']); //TODO move name to common place
 	res.send('authed');
};

exports.tagsIndex = function(req, res) {

  var db= mongodb.db(process.env.MONGOLAB_URI);
  var col = db.collection("uis");

  col.findOne({type:'t'}, function(err, doc) {
        res.send(doc);
  });
};