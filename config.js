var path = require( 'path' );

module.exports = {
  port      : process.env.PORT || 3000,
  filePaths : {
    routes   : path.join( __dirname, 'routes' ),
    templates: path.join( __dirname, 'templates' ),
    layout   : path.join( __dirname, 'templates', 'layout.tpl' ),
  },
  couchdb : {
    host    : '127.0.0.1',
    port    : 5984,
    username: process.env.COUCHDB_USER,
    password: process.env.COUCHDB_PASSWORD
  }
};
