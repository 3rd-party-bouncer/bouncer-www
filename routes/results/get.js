var logger = require( '../../lib/logger' );

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




    io.on('connection', function (socket) {
      log( '---> on connection' );
      socket.on('bouncerData', function (data) {
        log(data);
        socket.emit('bouncerData', { hello: 'world' });
      });

      socket.emit('bouncerData', { hello: 'world' });

    });




    var db = cushion.database( 'bouncer' );

    db.info( function( error, info ) {
      //console.log( 'db.info ',  error || info );
    });

    db.allDocuments(function(error, info, allDocs) {
      //console.log( 'db.allDocuments', error || allDocs );
    });

    var doc = db.document( req.param('id') );

    doc.load( function( err, b ) {
      //console.log( 'doc.load err', err, 'doc.load b', b.body() );
      var docBody = b.body();

      app.get( 'helper' ).renderPage(
          app.get( 'config' ),
          __filename,
          { id: req.param('id'),
            foo: docBody.foo,
            url: docBody.url,
            whitelist: docBody.whitelist,
          }, // templateData
          function (error, page) {
            res.send( page );
            if ( error ) {
              throw error;
            }
          }
        );


    });
  }
};
