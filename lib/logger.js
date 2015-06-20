var debug = require( 'debug' );

module.exports = {
  request       : debug( 'request' ),
  mongo         : debug( 'mongo' ),
  bouncer       : debug( 'bouncer' ),
  bouncerApp    : debug( 'bouncerApp' )
};
