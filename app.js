
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
    ,expressLayouts = require('express-ejs-layouts')
    ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
    app.set('layout', 'layout'); // defaults to 'layout'
    app.use(expressLayouts);

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

app.get('/', streamHandler.index.bind(streamHandler));
app.get('/stream', streamHandler.main.bind(streamHandler));

app.get('/stream/:userId', streamHandler.stream.bind(streamHandler));

app.get('/login', routes.login);
app.get('/login_callback', routes.loginCallback);

http.createServer(app).listen(app.get('port'), function(){
  //console.log("Express server listening on port " + app.get('port'));
});
