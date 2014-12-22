<h1>Results for  <%= id %></h1>

<dl id="resultData">
  <dt>data</dt>
  <% _.each( results , function( result ) { %>
  <dd>
    <strong>allowedUrls:</strong> <%= result.allowedUrls %> <br>
    <strong>blockedUrls:</strong> <%= result.blockedUrls %> <br>
    <strong>firstView</strong><br><br>
    <table>
      <thead>
        <tr>
          <th>loadEnd</th>
          <th>loadTime</th>
          <th>requests</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> <%= result.firstView.loadEnd %> </td>
          <td> <%= result.firstView.loadTime %> </td>
          <td> <%= result.firstView.requests %> </td>
        </tr>
      </tbody>
    </table>

    <strong>repeatView</strong>
    <table>
      <thead>
        <tr>
          <th>loadEnd</th>
          <th>loadTime</th>
          <th>requests</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> <%= result.repeatView.loadEnd %> </td>
          <td> <%= result.repeatView.loadTime %> </td>
          <td> <%= result.repeatView.requests %> </td>
        </tr>
      </tbody>
    </table>
  </dd>
  <% } );%>
</dl>


<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>

<script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
<script>

  var template = _.template( document.getElementById('dataTable').innerHTML );

  var socket = io.connect('http://localhost:8080');
  socket.on('bouncerData', function (data) {
    console.log( data, template(data) );
    document.getElementById('resultData').innerHTML += template(data);
  });
</script>
