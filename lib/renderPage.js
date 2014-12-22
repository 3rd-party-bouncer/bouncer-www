var _    = require( 'lodash' );
var fs   = require( 'fs' );
var path = require( 'path' );

// caching!!!!
var cache = {
  templateStrings : {},
  layout          : false
};

function render ( config, fileName, pageData, callback ) {
  var content;

  var fileNameList   = path.normalize( fileName ).split('/');
  var templateFolder = fileNameList[ fileNameList.length - 2];
  var templateName   = fileNameList[ fileNameList.length - 1 ].replace('js', 'tpl');
  var templatePath = path.join( config.filePaths.templates, templateFolder, templateName );
  var templateId = templateFolder + '-' + templateName;

  if ( !cache.templateStrings[ templateId ] ) {

    fs.readFile( templatePath, 'utf8', function ( err, templateString) {
      var page;
      if ( err ){
        page = _.template( 'internal server shiiiit', pageData );
      } else {

        cache.templateStrings[ templateId ] = templateString;
        //console.log( '--> ', cache.templateStrings[ templateId ], templateId );
        content = _.template(
          cache.templateStrings[ templateId ],
          pageData
        );
        page = _.template(
          cache.layout,
          {
            content: content
          }
        ) + '<template id="dataTable"><% _.each( results , function( result ) { %> <dd><strong>allowedUrls:</strong> <%= result.allowedUrls %> <br><strong>blockedUrls:</strong> <%= result.blockedUrls %> <br><strong>firstView</strong><br><br><table><thead><tr><th>loadEnd</th><th>loadTime</th><th>requests</th>       </tr>     </thead>     <tbody>       <tr><td> <%= result.firstView.loadEnd %> </td><td> <%= result.firstView.loadTime %> </td><td> <%= result.firstView.requests %> </td>       </tr>     </tbody>   </table>   <strong>repeatView</strong>   <table>     <thead>       <tr><th>loadEnd</th><th>loadTime</th><th>requests</th>       </tr>     </thead>     <tbody>       <tr><td> <%= result.repeatView.loadEnd %> </td><td> <%= result.repeatView.loadTime %> </td><td> <%= result.repeatView.requests %> </td>       </tr>     </tbody>   </table> </dd> <% } );%></template>';
      }

      callback( err, page );

    } );

  } else {
    content = _.template(
      cache.templateStrings[ templateId ],
      pageData
    );
    var page = _.template(
      cache.layout,
      {
        content: content
      }
    ) + '<template id="dataTable"><% _.each( results , function( result ) { %> <dd><strong>allowedUrls:</strong> <%= result.allowedUrls %> <br><strong>blockedUrls:</strong> <%= result.blockedUrls %> <br><strong>firstView</strong><br><br><table><thead><tr><th>loadEnd</th><th>loadTime</th><th>requests</th>       </tr>     </thead>     <tbody>       <tr><td> <%= result.firstView.loadEnd %> </td><td> <%= result.firstView.loadTime %> </td><td> <%= result.firstView.requests %> </td>       </tr>     </tbody>   </table>   <strong>repeatView</strong>   <table>     <thead>       <tr><th>loadEnd</th><th>loadTime</th><th>requests</th>       </tr>     </thead>     <tbody>       <tr><td> <%= result.repeatView.loadEnd %> </td><td> <%= result.repeatView.loadTime %> </td><td> <%= result.repeatView.requests %> </td>       </tr>     </tbody>   </table> </dd> <% } );%></template>';

    callback(
      null,
      page
    );

  }

}


module.exports = function ( config, fileName, pageData, callback ) {
  //console.log( 'renderPAGE' );
 if ( !cache.layout ){
  fs.readFile( config.filePaths.layout, 'utf8', function (err, data ) {
    if ( err ){
      callback( err, _.template( 'internal server shiiiit', pageData ) );
      return;
    }
    cache.layout = data;

    render( config, fileName, pageData, callback )
  })
 } else {

  render( config, fileName, pageData, callback );
 }

};


