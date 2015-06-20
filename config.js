var path = require( 'path' );

module.exports = {
  port      : process.env.PORT || 3000,
  filePaths : {
    routes   : path.join( __dirname, 'routes' ),
    templates: path.join( __dirname, 'templates' ),
    layout   : path.join( __dirname, 'templates', 'layout.tpl' ),
  },
  mongodb : {
    url      : process.env.MONGODB_URL || 'localhost:27017',
    database : process.env.MONGODB_DATABASE || 'bouncer'
  },
  bouncer: {
    apiKey   : process.env.API_KEY,
    location : process.env.LOCATION || '',
    server   : process.env.SERVER
  }
};
