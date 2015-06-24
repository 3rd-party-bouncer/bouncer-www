;( function( d3 ) {
  /**
   * Get parent of dom element with
   * given class
   *
   * @param  {Object} el        element
   * @param  {String} className className
   * @return {Object}           parent element with given class
   */
  function getParent( el, className ) {
    var parent = null;
    var p      = el.parentNode;

    while ( p !== null ) {
      var o = p;

      if ( o.classList.contains( className ) ) {
        parent = o;
        break;
      }

      p = o.parentNode;
    }
    return parent; // returns an Array []
  }

  var id = window.location.href.split( '/' ).pop();

  var keysToRender = [ {
    key : 'render',
    label : 'Start Render'
  }, {
    key   : 'SpeedIndex',
    label : 'SpeedIndex'
  }, {
    key   : 'domElements',
    label : 'Number of DOM Elements'
  }, {
    key   : 'docTime',
    label : 'Document Complete'
  }, {
    key   : 'fullyLoaded',
    label : 'Fully loaded'
  }, {
    key   : 'requests',
    label : 'Number of Requests'
  } ];

  var loading  = document.getElementById( 'loading' );
  var table    = document.getElementById( 'resultTable' );
  var template = document.getElementById( 'resultTableEachTpl' );
  var status   = document.getElementById( 'status' );

  function _getNormalizedData( data ) {
    var normalizedData = [];

    keysToRender.forEach( function( key ) {
      normalizedData.push( {
        name : key.label,
        key  : key.key,
        data : [
          data.map( function( date ) {
            console.log( date );
            if ( key.key !== 'requests' ) {
              return {
                value : date.response.data.median.firstView ?
                        date.response.data.median.firstView[ key.key ] :
                        0,
                allowed : date.allowedUrl
              };
            } else {
              return {
                value : date.response.data.median.firstView ?
                        date.response.data.median.firstView[ key.key ][ 0 ] :
                        0,
                allowed : date.allowedUrl
              };
            }
          } ),
          data.map( function( date ) {
            if ( key.key !== 'requests' ) {
              return {
                value : date.response.data.median.repeatView ?
                        date.response.data.median.repeatView[ key.key ] :
                        0,
                allowed : date.allowedUrl
              };
            } else {
              return {
                value : date.response.data.median.repeatView ?
                        date.response.data.median.repeatView[ key.key ][ 0 ] :
                        0,
                allowed : date.allowedUrl
              };
            }
          } )
        ]
      } );
    } )

    return normalizedData;
  }

  function showBarHelp( data ) {
    d3.selectAll( '.resultGraphs--help' ).remove();

    var bar           = this;
    var bBox          = bar.getBBox();
    var detailBox     = document.createElement( 'div' );
    var listContainer = getParent( bar, 'resultGraphs--item--container' );

    detailBox.classList.add( 'resultGraphs--help' );

    detailBox.innerHTML =
      'Allowed 3rd Party URL(s):<br><strong>' + bar.dataset.allowed + '</strong>';

    listContainer.appendChild( detailBox );

    detailBox.classList.add( 'p--graphs--detailBox' );
    detailBox.style.left = ( bBox.x + bBox.width / 2 - detailBox.getBoundingClientRect().width / 2 ) + 'px';
    detailBox.style.top = ( bBox.y + bBox.height + detailBox.getBoundingClientRect().height ) + 'px';
  }

  function renderTable( container, data ) {
    var table = document.querySelector( container );
    table.innerHTML = nunjucks.renderString( template.innerHTML, { data : data } );
  }

  function renderGraphs( container, data ) {
    var resultGraphs   = d3.select( container );
    var normalizedData = _getNormalizedData( data );

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
    var margin = { top : 25, right : 0, bottom : 30, left : 0 };
    var width = containerEl.clientWidth - margin.left - margin.right;
    var height   = width * 0.6 - margin.top - margin.bottom;


    var y = d3.scale.linear()
        .domain( [
          0,
          d3.max(
            [
              d3.max( data.data[ 0 ].map( function( d ) { return d.value; } ) ),
              d3.max( data.data[ 1 ].map( function( d ) { return d.value; } ) )
            ]
          )
        ] )
        .range( [ height, 0 ] )

    var x = d3.scale.linear()
        .domain( [ 0, data.data[ 0 ].length + 1 ] )
        .range( [ 0, width ] );

    var xAxis = d3.svg.axis()
        .scale( x )
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
        .y( function( d ) { return y( d.value ); } )
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

    var bgBars = svg.append( 'g' )
        .attr( 'class', 'resultGraphs--bgBars' );

    bgBars.selectAll( '.resultGraphs--bgBar' )
        .data( data.data[ 0 ] )
      .enter().append( 'rect' )
        .attr( 'class', 'resultGraphs--bgBar' )
        .attr( 'x', function( d, i ) { return x( i + .5 ); } )
        .attr( 'width', function( d, i ) { return x( i + .5 ) - x( i - .5 ) } )
        .attr( 'y', function( d ) { return 0; } )
        .attr( 'height', function( d ) { return height; } )
        .attr( 'data-allowed', function( d ) { return d.allowed } )
        .on( 'mouseenter', showBarHelp );

    var gy = svg.append( 'g' )
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
        .attr( 'cy', function( d ) { return y( d.value ); });

    circles.selectAll( '.resultGraphs--circle__repeat' )
        .data( data.data[ 1 ] )
      .enter().append( 'circle' )
        .attr( 'r', 6 )
        .attr( 'class', 'resultGraphs--circle__repeat' )
        .attr( 'cx', function( d, i ) { return x( i + 1 ); } )
        .attr( 'cy', function( d ) { return y( d.value ); });

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
