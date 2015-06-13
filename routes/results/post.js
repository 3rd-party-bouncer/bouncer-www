var Bouncer     = require( 'bouncer' );

var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                 process.env.COUCHDB_USER, // username
                 process.env.COUCHDB_PASSWORD // password
              );

module.exports = {
  route : 'results',
  cllbck: function( req, res ) {

    var db   = cushion.database( 'bouncer' );
    var doc  = db.document();
    var app  = req.app;
    var io   = app.get( 'io' );

    var config   = app.get( 'config' );
    var bouncers = app.get( 'bouncers' );


    var options  = {
      allowedDomains : req.body.allowedDomains.trim().split( ',' ),
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
        runs           : options.runs,
        finished       : false,
        data           : []
      }
    );

    doc.save(function( err, savedDoc){
      options[ 'log' ] = function( message ) { console.log( savedDoc._id, message ); };

      // kick off bouncer
      bouncers[ savedDoc._id ] = new Bouncer( options );
      bouncers[ savedDoc._id ].runner.on( 'data', function( runData ) {
        var data = doc.body( 'data' );
        var log  = app.get( 'logger' ).couch;

        data.push( runData );

        doc.body( 'data', data );

        doc.save( function( err, doc ) {
          if ( err ) {
            return log( err );
          }

          console.log( 'Saved bouncer run' );
        } );
      } );

      bouncers[ savedDoc._id ].run( function( err ) {
        if ( err ) {
          console.log( err );

          delete bouncers[ savedDoc._id ];
          console.log( 'Bouncer finished!' );
          console.log( 'bouncers available', bouncers );

          return;
        }

        // TODO
        // dirty solution to avoid update conflicts
        // fix this
        setTimeout( function() {
          doc.body( 'finished', true );

          doc.save( function( err, doc ) {
            if ( err ) {
              return console.log( err );
            }

            delete bouncers[ savedDoc._id ];
            console.log( 'Bouncer finished!' );
            console.log( 'bouncers available', bouncers );
          } );
        }, 500 );
      } );

      app.set( 'bouncers', bouncers );

      res.redirect( 302, '/results/' + savedDoc._id );
    } );
  }
};
