var express     = require( 'express' );
var bodyParser  = require( 'body-parser' );
var compression = require( 'compression' );
var config      = require( './config' );
var loadRoutes  = require( './lib/loadRoutes.js' );
var renderPage  = require( './lib/renderPage' );
var logger      = require( './lib/logger' );
var app         = express();

app.use( bodyParser.urlencoded({ extended: true }) );

app.set( 'config', config );
app.set( 'logger', logger );
app.set( 'bouncers', {} );
app.set(
  'helper', { renderPage: renderPage }
);

loadRoutes( app );

app.use( compression() );
app.use( express.static( __dirname + '/public', { maxAge : 31536000000 } ) );

app.listen( config.port );
