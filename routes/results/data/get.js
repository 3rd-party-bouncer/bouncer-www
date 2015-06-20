var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                process.env.COUCHDB_USER, // username
                process.env.COUCHDB_PASSWORD // password
              );

var ObjectID = require( 'mongodb' ).ObjectID;

module.exports = {
  route : 'results/data/:id',
  cllbck: function( req, res ) {
    var app            = req.app;
    var db             = app.get( 'db' );
    var collection     = db.collection( 'documents' );

    var db  = cushion.database( 'bouncer' );
    var doc = db.document( req.params.id );

    collection.find( {
      _id : new ObjectID( req.params.id )
    } ).toArray( function( err, documents ) {
      if ( err ){
        return console.log( err );
      }

      var docBody = documents[ 0 ];

      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify( docBody ) );
    } );
  }
};