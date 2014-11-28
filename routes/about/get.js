module.exports = {
  route: 'about',
  cllbck: function( req, res ) {
    console.log('-----> ABOUT');
    req.app.get( 'helper' ).renderPage(
      req.app.get( 'config' ),
      __filename,
      {}, // templateData
      function (error, page) {
        res.send( page );
        if ( error ) {
          throw error;
        }
      }
    );
  }
};
