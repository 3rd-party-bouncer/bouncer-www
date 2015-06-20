<img alt="3rd Party Bouncer" height="250" itemprop="image" src="https://avatars3.githubusercontent.com/u/9380807?v=3&amp;s=250" width="250">
<h2 class="result--headline">Results for <a href="<%= url %>"><%= url %></a></h2>
<div id="status" class="status is-processing"><strong id="loading">Processing...</strong></div>
<main id="results">
  <table id="resultTable" class="resultTable"></table>
  <ul class="resultGraphs">
    <li>
      <h3>Start render</h3>
      <div id="resultGraph--render" class="graph--container"></div>
    <li>
      <h3>Speed Index</h3>
      <div id="resultGraph--SpeedIndex" class="graph--container"></div>
    <li>
      <h3>Number of DOM elements</h3>
      <div id="resultGraph--domElements" class="graph--container"></div>
  </ul>
</main>

<script id="resultsTpl" type="text/template">
  <thead>
    <tr>
      <th></th>
      <th>Allowed Domains</th>
      <th>Blocked Domains</th>
      <th>Start Render</th>
      <th>SpeedIndex</th>
      <th>DOM Elements</th>
      <th>Document complete</th>
      <th>Fully Loaded</th>
      <th>Number of Requests</th>
      <th></th>
    </tr>
  </thead>

  <tbody>
    {% for date in data %}
      <tr>
        <td>{{ loop.index }}</td>
        <td>{{ date.allowedUrl }}</td>
        <td>{{ date.blockedUrl }}</td>
        <td>{{ date.response.data.median.firstView.render }}ms | {{ date.response.data.median.repeatView.render }}ms</td>
        <td>{{ date.response.data.median.firstView.SpeedIndex }} | {{ date.response.data.median.repeatView.SpeedIndex }}</td>
        <td>{{ date.response.data.median.firstView.domElements }} | {{ date.response.data.median.repeatView.domElements }}</td>
        <td>{{ date.response.data.median.firstView.docTime }} | {{ date.response.data.median.repeatView.docTime }}</td>
        <td>{{ date.response.data.median.firstView.fullyLoaded }} | {{ date.response.data.median.repeatView.fullyLoaded }}</td>
        <td>{{ date.response.data.median.firstView.requests[ 0 ] }} | {{ date.response.data.median.repeatView.requests[ 0 ] }}</td>
        <td><a href="{{ date.response.data.summary }}" target="_blank">View Result</a></td>
    {% endfor %}
  </tbody>
</script>
<script src="/results.js" async defer></script>
