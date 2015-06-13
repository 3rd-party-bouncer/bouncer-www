var debug = require( 'debug' );

module.exports = {
  request       : debug( 'request' ),
  couch         : debug( 'couch' ),
  bouncer       : debug( 'bouncer' ),
  bouncerApp    : debug( 'bouncerApp' )
};
