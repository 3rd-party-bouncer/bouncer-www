;( function( d3 ) {
  var id = window.location.href.split( '/' ).pop();

  var keysToRender = [ {
    key : 'render',
    label : 'Start Render'
  }, {
    key : 'SpeedIndex',
    label : 'SpeedIndex'
  }, {
    key : 'domElements',
    label : 'Number of DOM Elements'
  }, {
    key : 'docTime',
    label : 'Document Complete'
  }, {
    key : 'fullyLoaded',
    label : 'Fully loaded'
  } ];

  var loading  = document.getElementById( 'loading' );
  var table    = document.getElementById( 'resultTable' );
  var template = document.getElementById( 'resultsTpl' );
  var status   = document.getElementById( 'status' );

  var resultGraphs = d3.select( '.resultGraphs' );

  function renderGraphs( data ) {
    var normalizedData = [];

    keysToRender.forEach( function( key ) {
      normalizedData.push( {
        name : key.label,
        key  : key.key,
        data : [
          data.map( function( date ) {
            return date.response.data.median.firstView ?
              date.response.data.median.firstView[ key.key ] :
              0;
          } ),
          data.map( function( date ) {
            return date.response.data.median.repeatView ?
              date.response.data.median.repeatView[ key.key ] :
              0;
          } )
        ]
      } );
    } )

    var items = resultGraphs.selectAll( '.resultGraphs--item' )
                            .data( normalizedData );

    items.enter()
          .append( 'li' )
          .attr( 'class', 'resultGraphs--item' )
          .attr( 'id', function( d ) {
            return 'resultGraph--item-' + d.key;
          } )
          .html( function( d ) {
            return '<h4 class="resultGraphs--item--headline">' + d.name + '</h4>' +
                    '<div class="resultGraphs--item--container"></div>';
          } );

    items.each( renderGraph );

    items.exit().remove()
  }

  function renderGraph( data ) {
    var containerEl = this.querySelector( '.resultGraphs--item--container' );
    var margin = { top : 20, right : 0, bottom : 30, left : 0 };
    var width = containerEl.clientWidth - margin.left - margin.right;
    var height   = width * 0.6 - margin.top - margin.bottom;


    var y = d3.scale.linear()
        .domain( [
              0,
              d3.max( [ d3.max( data.data[ 0 ] ), d3.max( data.data[ 1 ] ) ] )
        ] )
        .range( [ height, 0 ] )

    var x = d3.scale.linear()
        .domain( [ 0, data.data[ 0 ].length + 1 ] )
        .range( [ 0, width ] );

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat( function( d ) {
          return ( d % 1 !== 0 || ! d || d === data.data[ 0 ].length + 1 ) ?
                   '' :
                   d;
        } )
        .orient( 'bottom' );

    var yAxis = d3.svg.axis()
        .scale( y )
        .tickSize( width )
        .orient( 'right' );

    var container = d3.select( containerEl ).html( '<svg></svg>' );
    var svg       = container.select( 'svg' )
                              .attr( 'width', width + margin.left + margin.right )
                              .attr( 'height', height + margin.top + margin.bottom )
                              .append( 'g' )
                                .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var barChartWidth = 12;

    var gy = svg.append('g')
        .attr( 'class', 'resultGraphs--yAxisTicks' )
        .call( yAxis )
        .call( customAxis );

    var gx = svg.append( 'g' )
        .attr( 'class', 'resultGraphs--xAxisTicks' )
        .attr( 'transform', 'translate(0,' + height + ')' )
        .call( xAxis );

    svg.selectAll( '.resultGraphs--bar__first' )
        .data( data.data[ 0 ] )
      .enter().append( 'rect' )
        .attr( 'class', 'resultGraphs--bar__first' )
        .attr( 'x', function( d, i ) { return x( i + 1 ) - barChartWidth; } )
        .attr( 'width', barChartWidth )
        .attr( 'y', function( d ) { return y( d ); })
        .attr( 'height', function(d) { return height - y( d ); } );

    svg.selectAll( '.resultGraphs--bar__repeat' )
        .data( data.data[ 1 ] )
      .enter().append( 'rect' )
        .attr( 'class', 'resultGraphs--bar__repeat' )
        .attr( 'x', function( d, i ) { return x( i + 1 ); } )
        .attr( 'width', barChartWidth )
        .attr( 'y', function( d ) { return y( d ); })
        .attr( 'height', function(d) { return height - y( d ); } );

    function customAxis( g ) {
      g.selectAll( 'text' )
          .attr( 'x', 4 )
          .attr( 'dy', -4 );
    }
  }

  function fetchData() {
    fetch( '/results/data/' + id )
      .then( function( response ) {
        return response.json();
      } )
      .then( function( result ) {
        table.innerHTML = nunjucks.renderString( template.innerHTML, result );

        renderGraphs( result.data );

        if ( ! result.finished ) {
          loading.innerText = result.runsToGo ?
            result.runsToGo + ' run(s) to go' :
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
} )( d3 );
