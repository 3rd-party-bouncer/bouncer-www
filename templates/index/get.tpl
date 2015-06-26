<main>
  <h2>Welcome!</h2>
  <p>You have to deal with 3rd parties on your site? And you wanna now how each 3rd party influences your site's performance?</p>
  <p>Great! Give bouncer a try.</p>
  <p>In case you wanna know how it is working technically you will find more info <a href="/aobut">here</a>.
  <form class="form" action="/results" method="post">
    <label class="form--label">
      <div>Website you want to run against</div>
      <input type="url" name="url" placeholder="http://perf-tooling.today/" required>
    </label>
    <label class="form--label">
      <div>List of 3rd party domains you want/have to include</div>
      <small>comma seperated</small>
      <textarea name="allowedDomains" placeholder="cdn.lorem.com,cdn.ipsum.net" id="" cols="30" rows="10"></textarea>
    </label>
    <label class="form--label">
      <div>Number of WebpageTest runs per 3rd party evaluation : 3</div>
      <small>Currently we stick to 3 runs to check the cost of the private wpt instance</small>
      <input type="hidden" name="runs" value="3">
    </label>
    <button class="form--button">get your results</button>
  </form>
</main>
