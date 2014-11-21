var path = require( 'path' );

module.exports = {
  port      : process.env.PORT || 3000,
  filePaths : {
    routes   : path.join( __dirname, 'routes' ),
    templates: path.join( __dirname, 'templates' ),
    layout   : path.join( __dirname, 'templates', 'layout.tpl' ),
  }
};
