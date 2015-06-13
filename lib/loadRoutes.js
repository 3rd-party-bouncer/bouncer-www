var fs    = require( 'fs' );
var path  = require( 'path' );

module.exports = function( app ){
  /**
   * Go through entries included in a directory
   *
   * @param  {String} path path
   */
  function setUpDirectory( filePath ) {
    var methods = fs.readdirSync( filePath );

    methods.forEach( function( method ){
      var setUpPath = path.join( filePath, method );
      if ( fs.statSync( setUpPath ).isDirectory() ) {
        return setUpDirectory( setUpPath );
      }

      setUpMethod( setUpPath );
    } );
  }

  /**
   * Register new endpoint and method
   * to the application
   *
   * @param {String} path path
   */
  function setUpMethod( filePath ) {
    var parts  = filePath.split( path.sep );
    var method = parts[ parts.length - 1 ].replace( /\.js$/gi,'' );

    if ( typeof app[ method ] === 'function' ){
      var mdl = require( filePath );

      app[ method ] (
        '/' + mdl.route,
        mdl.cllbck
      );
    }

  }

  var routes;
  var basePath = app.get( 'config' ).filePaths.routes;

  try {
    routes = fs.readdirSync( basePath );
  } catch (error) {
    console.log( error );
    throw new Error( 'filePaths \'routes\' does not exist' );
  }

  routes.forEach( function( route ) {
    setUpDirectory( path.join( basePath, route ) );
  } );
};
