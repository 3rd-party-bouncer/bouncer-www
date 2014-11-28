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

  routes.forEach( function( route ) {
    var methods = fs.readdirSync(
      path.join( basePath, route )
    );

    methods.forEach( function( method ){
      method = method.replace( /\.js$/gi,'' );
      if ( typeof app[method] === 'function' ){
        console.log( '--> ', route , method );
        var mdl = require( path.join( basePath, route , method ) );
        app[method](
          '/' + mdl.route,
          mdl.cllbck
        );
      }
    } );
  } );
};
