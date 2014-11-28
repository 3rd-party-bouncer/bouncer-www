var debug = require( 'debug' );

module.exports = {
  request  : debug( 'request' ),
  socketio : debug( 'socketio' )
};
