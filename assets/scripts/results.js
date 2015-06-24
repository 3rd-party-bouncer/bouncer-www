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
  var template = document.getElementById( 'resultTableEachTpl' );
  var status   = document.getElementById( 'status' );

  function renderTable( container, data ) {
    var table = document.querySelector( container );
    table.innerHTML = nunjucks.renderString( template.innerHTML, { data : data } );
  }

  function renderGraphs( container, data ) {
    var resultGraphs = d3.select( container );
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

    var line = d3.svg.line()
        .x( function( d, i ) { return x( i + 1 ); } )
        .y( function( d ) { return y( d ); } )
        .interpolate( 'cardinal' );

    var container = d3.select( containerEl ).html( '<svg></svg>' );
    var svg       = container.select( 'svg' )
                              .attr( 'width', width + margin.left + margin.right )
                              .attr( 'height', height + margin.top + margin.bottom )
                              .append( 'g' )
                                .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var barChartWidth = 12;

    var marks = svg.append( 'g' )
                    .attr( 'class', 'resultGraphs--marks' );

    // marks.append( 'line' )
    //       .attr( 'class', 'resultGraphs--mark__first')
    //       .attr( 'x1', 0 )
    //       .attr( 'x2', width )
    //       .attr( 'y1', y( data.data[ 0 ][ 0 ] ) )
    //       .attr( 'y2', y( data.data[ 0 ][ 0 ] ) );

    // marks.append( 'line' )
    //       .attr( 'class', 'resultGraphs--mark__repeat')
    //       .attr( 'x1', 0 )
    //       .attr( 'x2', width )
    //       .attr( 'y1', y( data.data[ 1 ][ 0 ] ) )
    //       .attr( 'y2', y( data.data[ 1 ][ 0 ] ) );


    var gy = svg.append('g')
        .attr( 'class', 'resultGraphs--yAxisTicks' )
        .call( yAxis )
        .call( customAxis );

    var gx = svg.append( 'g' )
        .attr( 'class', 'resultGraphs--xAxisTicks' )
        .attr( 'transform', 'translate(0,' + height + ')' )
        .call( xAxis );

    svg.append( 'path' )
          .datum( data.data[ 0 ] )
          .attr( 'class', 'resultGraphs--line__first' )
          .attr( 'd', line );

    svg.append( 'path' )
          .datum( data.data[ 1 ] )
          .attr( 'class', 'resultGraphs--line__repeat' )
          .attr( 'd', line );

    var circles = svg.append( 'g' )
                  .attr( 'class', 'resultGraphs--circles' );

    circles.selectAll( '.resultGraphs--circle__first' )
        .data( data.data[ 0 ] )
      .enter().append( 'circle' )
        .attr( 'r', 6 )
        .attr( 'class', 'resultGraphs--circle__first' )
        .attr( 'cx', function( d, i ) { return x( i + 1 ); } )
        .attr( 'cy', function( d ) { return y( d ); });

    circles.selectAll( '.resultGraphs--circle__repeat' )
        .data( data.data[ 1 ] )
      .enter().append( 'circle' )
        .attr( 'r', 6 )
        .attr( 'class', 'resultGraphs--circle__repeat' )
        .attr( 'cx', function( d, i ) { return x( i + 1 ); } )
        .attr( 'cy', function( d ) { return y( d ); });

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

        if ( result.data.length && ! result.error ) {
          var allVsNoneData = [ result.data[ 0 ], result.data[ 1 ] ];

          renderTable( '#resultTable--allVsNone', allVsNoneData );
          renderGraphs( '#resultGraphs--allVsNone', allVsNoneData );

          var noneVsEachData = result.data.slice( 1 );

          renderTable( '#resultTable--noneVsEach', noneVsEachData );
          renderGraphs( '#resultGraphs--noneVsEach', noneVsEachData );
        }

        if ( ! result.finished ) {
          loading.innerText = result.runsToGo ?
            result.runsToGo + ' run(s) to go' :
            'Processing...';
          setTimeout( fetchData, 7500 );
        } else {
          status.classList.remove( 'is-processing' );

          if ( ! result.error ) {
            status.classList.add( 'is-done' );
            loading.innerText = 'DONE!';
          } else {
            status.classList.add( 'is-failed' );
            loading.innerText = 'FAILED...';
          }
        }
      } );
  }

  fetchData();
} )( d3 );
