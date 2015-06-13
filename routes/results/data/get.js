var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                process.env.COUCHDB_USER, // username
                process.env.COUCHDB_PASSWORD // password
              );

module.exports = {
  route : 'results/data/:id',
  cllbck: function( req, res ) {

    var app            = req.app;
    var currentBouncer = app.get( 'bouncers' )[ req.params.id ];

    var db  = cushion.database( 'bouncer' );
    var doc = db.document( req.params.id );

    doc.load( function( err, b ) {
      if ( err ){
        return console.log( err );
      }

      var docBody = b.body();

      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify( docBody ) );
    } );
  }
};
