var express    = require( 'express' );
var bodyParser = require( 'body-parser' );
var config     = require( './config' );
var loadRoutes = require( './lib/loadRoutes.js' );
var renderPage = require( './lib/renderPage' );
var logger     = require( './lib/logger' );
var app        = express();


var server = require('http').Server(app);
var io     = require('socket.io')(server);

server.listen( 8080 );

app.use( bodyParser.urlencoded({ extended: true }) );

app.set( 'config', config );
app.set( 'io', io );
app.set( 'logger', logger );
app.set(
  'helper', { renderPage: renderPage }
);

loadRoutes( app );


app.use( express.static( __dirname + '/public', { maxAge : 31536000000 } ) );

app.listen( config.port );
