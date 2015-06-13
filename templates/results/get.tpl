<img alt="3rd Party Bouncer" height="250" itemprop="image" src="https://avatars3.githubusercontent.com/u/9380807?v=3&amp;s=250" width="250">
<h2 class="result--headline">Results for <a href="<%= url %>"><%= url %></a></h2>
<div id="status" class="status is-processing">Status <strong id="loading">Processing...</strong></div>
<main id="results"></main>


<script id="resultsTpl" type="text/template">
  <table class="resultTable">
    <thead>
      <tr>
        <th>Allowed Domains</th>
        <th>Blocked Domains</th>
        <th>Bytes Document Completes</th>
        <th>Bytes Document Load</th>

        <th>DOM Elements</th>
        <th>LoadEnd Event</th>
        <th>LoadTime</th>
        <th>Start render</th>
        <th>Number of Requests</th>
      </tr>
    </thead>

    <tbody>
      {% for date in data %}
        <tr>
          <td>{{ date.allowedUrls }}</td>
          <td>{{ date.blockedUrls }}</td>
          <td>{{ date.firstView.bytesDocComplete }} | {{ date.repeatView.bytesDocComplete }}</td>
          <td>{{ date.firstView.bytesDocLoad }} | {{ date.repeatView.bytesDocLoad }}</td>
          <td>{{ date.firstView.domElements }} | {{ date.repeatView.domElements }}</td>
          <td>{{ date.firstView.loadEnd }} | {{ date.repeatView.loadEnd }}</td>
          <td>{{ date.firstView.loadTime }} | {{ date.repeatView.loadTime }}</td>
          <td>{{ date.firstView.render }} | {{ date.repeatView.render }}</td>
          <td>{{ date.firstView.requests }} | {{ date.repeatView.requests }}</td>
      {% endfor %}
    </tbody>

  </table>
</script>
<script src="/results.js" async defer></script>
