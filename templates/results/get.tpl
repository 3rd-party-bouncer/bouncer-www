<h1>Results for  <%= id %></h1>

<dl>
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


  <dt>url</dt>
  <dd><%= url %></dd>

  <dt>allowedDomains</dt>
  <dd><%= allowedDomains %></dd>
</dl>


<div id="data"></div>

<script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
<script>

  var socket = io.connect('http://localhost:8080');
  socket.on('bouncerData', function (data) {
    console.log(data);
    document.getElementById('data').innerHTML += data.hello + '<br>';
  });
</script>
