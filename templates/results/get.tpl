<img alt="3rd Party Bouncer" itemprop="image" src="/bouncer.svg" width="300">
<h2 class="result--headline">Results for <a href="<%= url %>"><%= url %></a></h2>
<div id="status" class="status is-processing"><strong id="loading">Processing...</strong></div>
<main id="results">
  <ul class="u-listReset resultTable--legend">
    <li class="resultTable--value__first">First view
    <li class="resultTable--value__repeat">Repeat view
  </ul>
  <table id="resultTable" class="resultTable"></table>
  <ul class="resultGraphs">
  </ul>
</main>

<script id="resultsTpl" type="text/template">
  <thead>
    <tr>
      <th></th>
      <th>Allowed 3rd Party Domains</th>
      <th>Start Render</th>
      <th>SpeedIndex</th>
      <th>DOM Elements</th>
      <th>Document Complete</th>
      <th>Fully Loaded</th>
      <th>Number of Requests</th>
      <th></th>
    </tr>
  </thead>

  <tbody>
    {% for date in data %}
      {% if loop.index0 == 1 %}
        <tr class="resultTable--row__highlighted">
      {% else %}
        <tr>
      {% endif %}
        <td>{{ loop.index }}</td>
        <td>{{ date.allowedUrl }}</td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.render }}ms</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.render }}ms</span></td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.SpeedIndex }}</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.SpeedIndex }}</span></td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.domElements }}</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.domElements }}</span></td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.docTime }}ms</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.docTime }}ms</span></td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.fullyLoaded }}ms</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.fullyLoaded }}ms</span></td>
        <td><span class="resultTable--value__first">{{ date.response.data.median.firstView.requests[ 0 ] }}</span><span class="resultTable--value__repeat">{{ date.response.data.median.repeatView.requests[ 0 ] }}</span></td>
        <td><a href="{{ date.response.data.summary }}" target="_blank">View Result</a></td>
    {% endfor %}
  </tbody>
</script>
<script src="/results.js" async defer></script>
