<h1>Results for  <%= id %></h1>

<dl>
  <dt>foo</dt>
  <dd><%= foo %></dd>

  <dt>url</dt>
  <dd><%= url %></dd>

  <dt>whitelist</dt>
  <dd><%= whitelist %></dd>
</dl>


<div id="data"></div>

<script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
<script>

  var i = 1;

  var socket = io.connect('http://localhost:8080');
  socket.on('bouncerData', function (data) {
    console.log(data);
    document.getElementById('data').innerHTML += data.hello + '<br>';
  });
</script>
