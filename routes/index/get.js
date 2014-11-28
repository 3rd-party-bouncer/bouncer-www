var logger = require( '../../lib/logger' );

module.exports = {
  route: '/',
  cllbck: function( req, res ) {

    logger.request( 'req' );

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
