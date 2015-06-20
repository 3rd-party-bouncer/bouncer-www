var ObjectID = require( 'mongodb' ).ObjectID;

module.exports = {
  route : 'results/:id',
  cllbck: function( req, res ) {
    var app            = req.app;
    var db             = app.get( 'db' );
    var collection     = db.collection( 'documents' );

    collection.find( {
      _id : new ObjectID( req.params.id )
    } ).toArray( function( err, documents ) {
      if ( err ){
        return;
      }

      var doc = documents[ 0 ];

      app.get( 'helper' ).renderPage(
          app.get( 'config' ),
          __filename,
          { id: req.param.sid,
            results: doc,
            url: doc.url,
            allowedDomains: doc.allowedDomain,
          }, // templateData
          function ( error, page ) {
            res.send( page );
            if ( error ) {
              throw error;
            }
          }
        );
    } );
  }
};
