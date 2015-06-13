;( function() {
  var id = window.location.href.split( '/' ).pop();

  var loading  = document.getElementById( 'loading' );
  var table    = document.getElementById( 'resultTable' );
  var template = document.getElementById( 'resultsTpl' );
  var status   = document.getElementById( 'status' );

  function renderGraphs( data, key ) {
    var data = {
      labels: data.map( function( date, index ) { return index + 1; } ),
      series: [
        data.map( function( date ) {
          return date.response.data.median.firstView ?
            date.response.data.median.firstView[ key ] :
            0;
        } ),
        data.map( function( date ) {
          return date.response.data.median.repeatView ?
            date.response.data.median.repeatView[ key ] :
            0;
        } )
      ]
    };

    var options = {
      seriesBarDistance: 10
    };

    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    new Chartist.Bar( '#resultGraph--' + key, data, options, responsiveOptions);
  }

  function fetchData() {
    fetch( '/results/data/' + id )
      .then( function( response ) {
        return response.json();
      } )
      .then( function( result ) {
        console.log( result );

        table.innerHTML = nunjucks.renderString( template.innerHTML, result );

        renderGraphs( result.data, 'render' );
        renderGraphs( result.data, 'SpeedIndex' );
        renderGraphs( result.data, 'domElements' );

        if ( ! result.finished ) {
          loading.innerText = result.runsToGo ?
            result.runsToGo + ' runs to go' :
            'Processing...';
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
