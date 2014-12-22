<h1>Results for  <%= id %></h1>

<% if ( results.length ) { %>
<table>
  <thead>
    <tr>
      <th></th>
      <% _.forIn( results[0].firstView, function( value, key ) { %>
        <th> <%= key %> </th>
      <%  } ); %>
    </tr>
  </thead>

  <tbody>
    <% _.each( results, function( run ) { %>
      <tr>
        <td> <%= run.allowedUrls %> </td>
        <% _.forOwn( run.firstView , function( value, key ) { %>
           <td> <%= value %>/<%= run.repeatView[ key ] %> </td>
        <% } ); %>
      </tr>
    <% } ); %>
  </tbody>

</table>
<% } else { %>

<h2>still processing your data</h2>

<% } %>
