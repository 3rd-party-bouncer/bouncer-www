var Bouncer     = require( '@3rd-party-bouncer/bouncer' );

module.exports = {
  route : 'results',
  cllbck: function( req, res ) {
    var app        = req.app;
    var io         = app.get( 'io' );
    var db         = app.get( 'db' );
    var collection = db.collection( 'documents' );

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

    collection.insert( {
      url            : options.url,
      allowedDomains : options.allowedDomains,
      runs           : options.runs,
      finished       : false,
      data           : []
    }, function( err, result ) {
      var savedDoc = result.ops[ 0 ];
      // kick off bouncer
      bouncers[ savedDoc._id ] = new Bouncer( options );
      bouncers[ savedDoc._id ].runner.on( 'bouncer:data', function( runData ) {
        var log  = app.get( 'logger' ).couch;

        savedDoc.data.push( runData );
        savedDoc.runsToGo = runData.runsToGo

        if ( runData.runsToGo === 0 ) {
          savedDoc.finished = true;
        }

        collection.update( {
          _id : savedDoc._id
        }, savedDoc,
        function() {
          if ( err ) {
            return app.get( 'logger' ).mongo( err );
          }

          app.get( 'logger' ).mongo( 'Saved bouncer run' );
        } );
      } );

      bouncers[ savedDoc._id ].runner.on( 'bouncer:error', function( error ) {
        app.get( 'logger' ).bouncer( 'Failed bouncer run' );

        savedDoc.error = error;

        collection.update( {
          _id : savedDoc._id
        },
        savedDoc,
        function( error ) {
          if ( err ) {
            app.get( 'logger' ).bouncer( err );
          }
        } );
      } );

      bouncers[ savedDoc._id ].run( function( err ) {
        if ( err ) {
          app.get( 'logger' ).bouncer( 'Bouncer error!' );
          app.get( 'logger' ).bouncer( err );

          savedDoc.error    = err;
          savedDoc.finished = true;

          collection.update( {
            _id : savedDoc._id
          },
          savedDoc,
          function( error ) {
            if ( error ) {
              app.get( 'logger' ).bouncer( error );
            }
          } );
        }

        delete bouncers[ savedDoc._id ];
        app.get( 'logger' ).bouncerApp( 'bouncers available', bouncers );
      } );

      app.set( 'bouncers', bouncers );

      res.redirect( 302, '/results/' + savedDoc._id );
    } );
  }
};
