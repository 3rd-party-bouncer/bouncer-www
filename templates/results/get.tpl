<h1>Results for <a href="<%= url %>"><%= url %></a> </h1>

<% if ( results.length ) { %>
<table class="resultTable">
  <thead>
    <tr>
      <th>allowed domain</th>
      <% _.forIn( results[0].firstView, function( value, key ) { %>
        <th> <%= key %> </th>
      <%  } ); %>
    </tr>
  </thead>

  <tbody>
    <% _.each( results, function( run ) { %>
      <tr>
        <td> <a href="<%= run.summary %>"><%= run.allowedUrls %> </a> </td>
        <% _.forOwn( run.firstView , function( value, key ) { %>
           <td>
            <table>
              <tr>
                <th>first run</th>
                <td><%= value %></td>
              </tr>
              <tr>
                <th>repeated</th>
                <td><%= run.repeatView[ key ] %></td>
              </tr>
            </table>
           </td>
        <% } ); %>
      </tr>
    <% } ); %>
  </tbody>

</table>
<% } else { %>

<h2>still processing your data</h2>

<% } %>
