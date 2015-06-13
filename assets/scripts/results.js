;( function() {
  var id = window.location.href.split( '/' ).pop();

  var loading  = document.getElementById( 'loading' );
  var main     = document.getElementById( 'results' );
  var template = document.getElementById( 'resultsTpl' );
  var status   = document.getElementById( 'status' );

  function fetchData() {
    fetch( '/results/data/' + id )
      .then( function( response ) {
        return response.json();
      } )
      .then( function( result ) {
        console.log( result );

        main.innerHTML = nunjucks.renderString( template.innerHTML, result );

        if ( ! result.finished ) {
          setTimeout( fetchData, 7500 );
        } else {
          status.classList.remove( 'is-processing' );
          status.classList.add( 'is-done' );
          loading.innerText = 'DONE!';
        }
      } );
  }

  fetchData();
} )();
