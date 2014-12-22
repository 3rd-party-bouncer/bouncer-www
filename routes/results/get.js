var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                process.env.COUCHDB_USER, // username
                process.env.COUCHDB_PASSWORD // password
              );

module.exports = {
  route : 'results/:id',
  cllbck: function( req, res ) {
    var app = req.app;
    var io  = app.get( 'io' );
    var log = app.get( 'logger' ).socketio;

    var currentBouncer = app.get( 'bouncers' )[ req.param('id') ];

    io.on('connection', function (socket) {
      log( '---> on connection' );

      currentBouncer.runner.on( 'data', function(data){
        socket.emit( 'bouncerData', { result: data } );
      });

    });

    var db = cushion.database( 'bouncer' );
    var doc = db.document( req.param('id') );

    doc.load( function( err, b ) {
      if ( err ){
        console.log( err );
        return;
      }

      var docBody = b.body();

      app.get( 'helper' ).renderPage(
          app.get( 'config' ),
          __filename,
          { id: req.param('id'),
            results: docBody.data,
            url: docBody.url,
            allowedDomains: docBody.allowedDomains,
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
