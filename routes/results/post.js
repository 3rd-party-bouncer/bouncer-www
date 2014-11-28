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

  doc.body(
    { foo      : 'bar',
      url      : req.body.url,
      whitelist: req.body.whitelist
    }
  );

  doc.save(function( err,savedDoc){
    res.redirect( 302, '/results/' + savedDoc._id );
    // kick off bouncer
  });

  }

};
