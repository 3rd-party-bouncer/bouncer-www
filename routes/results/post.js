var Bouncer = require( 'bouncer' );

var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                 process.env.COUCHDB_USER, // username
                 process.env.COUCHDB_PASSWORD // password
              );

module.exports = {
  route : 'results',
  cllbck: function( req, res ) {

  var db  = cushion.database( 'bouncer' );
  var doc = db.document();
  var app = req.app;

  var config   = app.get( 'config' );
  var bouncers = app.get( 'bouncers' );

  var options  = {
    allowedDomains : req.body.allowedDomains.split( ',' ),
    key            : config.bouncer.apiKey,
    location       : config.bouncer.location,
    runs           : +req.body.runs,
    server         : config.bouncer.server,
    url            : req.body.url
  };

  doc.body(
    {
      url            : options.url,
      allowedDomains : options.allowedDomains,
      runs           : options.runs
    }
  );

  doc.save(function( err,savedDoc){
    options[ 'log' ] = function( message ) { console.log( savedDoc._id, message ); };

    // kick off bouncer
    bouncers[ savedDoc._id ] = new Bouncer( options );
    bouncers[ savedDoc._id ].runner.on( 'evaluated3rdParties', function( p ) {
        console.log( 'evaluated3rdParties', p );
    } );

    bouncers[ savedDoc._id ].run( function( err ) {
      if ( err ) {
        console.log( err );
        process.exit( 1 );
      }
      // remove bouncer instance from bouncers
      delete bouncers[ savedDoc._id ];
      console.log( 'Bouncer finished!' );
      console.log( 'bouncers available', bouncers );
    } );

    res.redirect( 302, '/results/' + savedDoc._id );

  });

  }

};
