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
    var doc = db.document( req.param('id') );

    doc.load( function( err, b ) {
      if ( err ){
        return;
      }
      //console.log( 'doc.load err', err, 'doc.load b', b.body() );
      var docBody = b.body();

      app.get( 'helper' ).renderPage(
          app.get( 'config' ),
          __filename,
          { id: req.param('id'),
            results: docBody.data,
            url: docBody.url,
            allowedDomains: docBody.allowedDomains,
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
