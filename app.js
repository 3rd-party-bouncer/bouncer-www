var express    = require( 'express' );
var bodyParser = require( 'body-parser' );
var config     = require( './config' );
var loadRoutes = require( './lib/loadRoutes.js' );
var renderPage = require( './lib/renderPage' );
var app        = express();

app.set( 'config', config );

app.use(bodyParser.urlencoded({ extended: true }));

app.set(
  'helper', { renderPage: renderPage }
);

loadRoutes( app );

//app.use( express.static( __dirname + '/public', { maxAge : 31536000000 } ) );

app.listen( config.port );
