module.exports = function( req, res ) {

  var renderedPage = req.app.get( 'helper' ).renderPage(
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
};
