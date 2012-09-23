var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , partials = require('express-partials')
  , engines = require('consolidate');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
    app.use(partials());
    app.engine('ejs', engines.ejs);
    app.set('layout', 'layout'); // defaults to 'layout'
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var streamHandler = new routes.StreamHandler();
var tagHandler = new routes.TagHandler();

app.get('/', streamHandler.index.bind(streamHandler));

app.get('/stream/:streamType', streamHandler.stream.bind(streamHandler));
app.get('/photo/:photoId', streamHandler.photo.bind(streamHandler));

app.get('/login', routes.login);
app.get('/login_callback', routes.loginCallback);
app.get('/logout', routes.logout);

app.post('/tag', tagHandler.addTag.bind(tagHandler));
app.get('/tag', tagHandler.fetchTagData.bind(tagHandler));

http.createServer(app).listen(app.get('port'), function() {
    console.log("server up");
});
