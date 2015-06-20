var express     = require( 'express' );
var bodyParser  = require( 'body-parser' );
var compression = require( 'compression' );
var config      = require( './config' );
var loadRoutes  = require( './lib/loadRoutes.js' );
var renderPage  = require( './lib/renderPage' );
var logger      = require( './lib/logger' );
var app         = express();

var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = process.env.MONGOLAB_URI ?
          process.env.MONGOLAB_URI :
          'mongodb://' + config.mongodb.url + '/' + config.mongodb.database;

// Use connect method to connect to the Server
MongoClient.connect(
  url,
  function( err, db ) {
    app.set( 'db', db );

    app.use( bodyParser.urlencoded({ extended: true }) );

    app.set( 'config', config );
    app.set( 'logger', logger );
    app.set( 'bouncers', {} );
    app.set(
      'helper', { renderPage: renderPage }
    );

    app.use( compression() );
    app.use( express.static( __dirname + '/public', { maxAge : 31536000000 } ) );

    loadRoutes( app );

    console.log( 'listening to port:' + config.port );
    app.listen( config.port );
  }
);

