var fs   = require( 'fs' );
var path = require( 'path' );

module.exports = function( app ){
  var routes;
  var basePath = app.get( 'config' ).filePaths.routes;

  try {
    routes = fs.readdirSync( basePath );
  } catch (error) {
    console.log( error );
    throw new Error( 'filePaths \'routes\' does not exist' );
  }

  routes.forEach( function( route) {
    var methods = fs.readdirSync(
      path.join( basePath, route )
    );
    methods.forEach( function( method ){
      method = method.replace( /\.js$/gi,'' );
      if ( typeof app[method] === 'function' ){
        var urlRoute = ( route === 'index' ? '' : route );

        if ( method.indexOf('-') > -1 ){
          var tmpMethod = method.split('-');
          method = tmpMethod[0];
          var id = tmpMethod[1];
          urlRoute += '/:'+ id;
        }

        console.log( method, urlRoute );
        app[method](
          '/' + urlRoute,
          require( path.join( basePath, route , method ) )
        );
      }
    } );
  } );
};
