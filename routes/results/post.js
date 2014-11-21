var cushion = new (require('cushion').Connection)(
                '127.0.0.1', // host
                 5984, // port
                'bouncer', // username
                'bouncer' // password
              );

module.exports = function( req, res ) {

  var db = cushion.database( 'bouncer' );

  var doc = db.document();

  var url = req.body.url;

  doc.body({'foo': 'bar', url: url});

  doc.save(function( err,savedDoc){
    console.log( savedDoc._id );
    res.redirect( 302, '/results/' + savedDoc._id );
    // kick off bouncer
  });

};
