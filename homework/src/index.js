"use strict";
{
  const hashString = s =>
    s.split("").reduce((a, b) => {
      let start = a;
      start = (start << 5) - start + b.charCodeAt(0);
      return start & start;
    }, 0);

  const cachedFetch = (url, options) => {
    let expiry = 5 * 60;
    if (typeof options === "number") {
      expiry = options;
      options = undefined;
    } else if (typeof options === "object") {
      expiry = options.seconds || expiry;
    }
    const cacheKey = hashString(url);
    const cached = localStorage.getItem(cacheKey);
    const whenCached = localStorage.getItem(`${cacheKey}:ts`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expiry) {
        const response = new Response(new Blob([cached]));
        return Promise.resolve(response);
      } else {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}:ts`);
      }
    }
    return fetch(url, options).then(response => {
      if (response.status === 200) {
        const ct = response.headers.get("Content-Type");
        if (ct && ct.includes("application/json")) {
          response
            .clone()
            .text()
            .then(content => {
              localStorage.setItem(cacheKey, content);
              localStorage.setItem(`${cacheKey}:ts`, Date.now());
            });
        }
      }
      return response;
    });
  };

  let user = "";
  let token = "";

  function drawLogin() {
    const root = document.getElementById("root");
    root.innerHTML = `
<div id="login-wrapper">
<div class="login-info">
<h2>To generate your GitHub token:</h2>
<ol>
<li><a href="https://github.com/settings/tokens" target="_blank">Visit This link to Generate New Token</a></li>
<li>Click Generate new token.</li>
<li>Give your token a descriptive name.</li>
<li>Select all read-only permissions for this token</li>
<li>Click Generate token.</li>
<li>Click  to copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.</li>
<li>Paste your token in the form below</li>
</ol>
</div>
  <form id="login-form" method="post">
  <input type="text" class="coolinput" placeholder="Github Login" id="input-user" required minlength="4">
  <input type="text" class="coolinput" placeholder="Github Token" id="input-token" required minlength="4">
  <input id="login-submit" type="submit">
  </form>
</div>`;
    const loginForm = document.querySelector("#login-form");
    loginForm.reportValidity();
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      user = event.target[0].value;
      token = event.target[1].value;

      return (
        status("making magic..."),
        fetchData(user, token).catch(err => {
          return status(`Disenchantment Occurred :(<span class="err-developer">${err.message}</span>`);
        })
      );
    });
  }
  drawLogin();

  const fetchData = async (user, token) => {
    ////////////////////////////////////////////////////////////////////////

    const creds = `${user}:${token}`;
    const auth = btoa(creds);
    const options = {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`
      }
    };
    ////////////////////////////////////////////////////////////////////////

    const urls = [
      `https://api.github.com/orgs/HackYourFuture`,
      `https://api.github.com/orgs/HackYourFuture/repos?per_page=100`,
      `https://api.github.com/orgs/HackYourFuture/events`
    ];
    const dataFromUrls = await Promise.all(urls.map(url => cachedFetch(url, options, 30 * 60).then(response => response.json())));
    const org = dataFromUrls[0];
    const orgrepos = dataFromUrls[1];
    const orgevents = dataFromUrls[2];

    const contributorsUrls = orgrepos.map(item => item.contributors_url);
    const contributorsAll = await Promise.all(
      contributorsUrls.map(url => cachedFetch(url, options, 60 * 60).then(response => (response.status === 204 ? [] : response.json())))
    );
    const contributorsFlattenArray = contributorsAll.reduce((acc, val) => acc.concat(val), []);
    const contributorsUnique = [];
    contributorsFlattenArray.forEach(function (contributor) {
      if (!this[contributor.login]) {
        this[contributor.login] = {
          avatar_url: contributor.avatar_url,
          login: contributor.login,
          url: contributor.url,
          html_url: contributor.html_url,
          contributions: 0
        };
        contributorsUnique.push(this[contributor.login]);
      }
      this[contributor.login].contributions += contributor.contributions;
    }, Object.create(null));
    const usersUrls = contributorsUnique.map(item => item.url);
    const users = await Promise.all(usersUrls.map(url => cachedFetch(url, options, 60 * 60).then(response => response.json())));
    const orgusercontrs = users.map(user => Object.assign(user, contributorsUnique.find(contributor => contributor.login === user.login)));

    const orgreposAndContributors = orgrepos.map((value, index) => {
      value.contributors = contributorsAll[index];
      return value;
    });

    return (
      status("Abracadabra!"),
      drawTemplate(),
      drawHome(org, orgrepos, orgevents, orgusercontrs),
      drawMenu(org, orgrepos, orgevents, orgusercontrs, orgreposAndContributors)
    );
  };

  function status(text) {
    const root = document.getElementById("root");
    root.innerHTML = `<div id=status><span></span></div>`;
    const statusText = document.querySelector("#status > span");
    statusText.innerHTML = text;
  }

  function drawTemplate() {
    const root = document.getElementById("root");
    root.innerHTML = `
<nav>
</nav>
<main>
<section id=home></section>
<section id=repositories></section>
<section id=contributors></section>
<footer></footer>
</main>`;
  }

  function drawMenu(org, orgrepos, orgevents, orgusercontrs, orgreposAndContributors) {
    const nav = document.querySelector("nav");
    nav.innerHTML = `  
<div id="logo"></div>
<dropdown>
<input id=t-1 type=checkbox checked>
<input id=t-2 type=checkbox>
<input id=t-3 type=checkbox>
<label for=t-1 id=l-1><i class="menu-home"></i></label>
<label for=t-2 id=l-2><i class="menu-repositories"></i><i class=sidebar-badge>000</i></label>
<label for=t-3 id=l-3><i class="menu-contributors"></i></label>
</dropdown>`;

    const logo = document.querySelector("#logo");
    logo.innerHTML = `<a href="${org.html_url}"><i style="background-image:url(${org.avatar_url})"></i></a>`;

    const labelHome = document.querySelector("#l-1");
    const labelRepositories = document.querySelector("#l-2");
    const labelContributors = document.querySelector("#l-3");
    const inputHome = document.querySelector("#t-1");
    const inputRepositories = document.querySelector("#t-2");
    const inputContributors = document.querySelector("#t-3");

    const home = document.querySelector("#home");
    const repositories = document.querySelector("#repositories");
    const contributors = document.querySelector("#contributors");
    const linkOnMainSection = document.querySelector("#home > span:nth-child(5) > a");

    document.querySelector("#l-2 > i.sidebar-badge").innerHTML = `${orgrepos.length}`;

    labelHome.onclick = event => {
      repositories.innerHTML = "";
      contributors.innerHTML = "";
      drawHome(org, orgrepos, orgevents, orgusercontrs);
      inputRepositories.checked = false;
      inputContributors.checked = false;
    };
    labelRepositories.onclick = event => {
      home.innerHTML = "";
      contributors.innerHTML = "";
      drawRepositories(orgreposAndContributors);
      inputHome.checked = false;
      inputContributors.checked = false;
    };
    labelContributors.onclick = event => {
      home.innerHTML = "";
      repositories.innerHTML = "";
      drawContributors(orgusercontrs);
      inputHome.checked = false;
      inputRepositories.checked = false;
    };
    linkOnMainSection.onclick = event => {
      home.innerHTML = "";
      repositories.innerHTML = "";
      drawContributors(orgusercontrs);
      inputHome.checked = false;
      inputRepositories.checked = false;
      inputContributors.checked = true;
    };
  }

  function drawHome(org, orgrepos, orgevents, orgusercontrs) {
    const home = document.querySelector("#home");
    home.innerHTML = `<span id=hi><span>Welcome Back!</span><span>To the place where magic is made.
</span></span>
<div id="stats-total-contrs"></div>
<div id="stats-total-users"></div>
<span class="main-details-text">Details</span><span class="main-top3-text">Top Magicians<a href=#>Overview all magicians</a></span>
<div id=details>
<div id="stats-public-repos"></div>
<div id="stats-private-repos"></div>
<div id="stats-issues"></div>
<div id="stats-forks"></div>
</div>
<div id=top></div>
<span>Latest activity</span>
<div id=activity>
</div>`;

    const statsPublicRepos = document.querySelector("#stats-public-repos");
    const statsPrivateRepos = document.querySelector("#stats-private-repos");
    const statsForks = document.querySelector("#stats-forks");
    const statsIssues = document.querySelector("#stats-issues");

    statsPublicRepos.innerHTML = `<span class="stats-number">${org.public_repos}</span><span class="stats-text">White Books</span>`;
    statsPrivateRepos.innerHTML = `<span class="stats-number">${org.total_private_repos}</span><span class="stats-text">Black Books</span>`;
    statsForks.innerHTML = `<span class="stats-number">${orgrepos.reduce(
      (sum, { forks_count }) => sum + forks_count,
      0
    )}</span><span class="stats-text">Spells Copied</span>`;
    statsIssues.innerHTML = `<span class="stats-number">${orgrepos.reduce(
      (sum, { open_issues_count }) => sum + open_issues_count,
      0
    )}</span><span class="stats-text">Dangerous Spells</span>`;

    const statsTotalContrs = document.querySelector("#stats-total-contrs");
    const statsTotalUsers = document.querySelector("#stats-total-users");

    statsTotalContrs.innerHTML = `<span class="stats-number">${orgusercontrs
      .map(item => item.contributions)
      .reduce((prev, next) => prev + next)}</span><span class="stats-text">Total Spells Casted</span>`;
    statsTotalUsers.innerHTML = `<span class="stats-number">${
      orgusercontrs.length
      }</span><span class="stats-text">Number Of Magicians</span>`;

    const top3Contributors = document.querySelector("#top");
    const mapped = orgusercontrs.map((el, i) => ({
      index: i,
      avatar_url: el.avatar_url,
      contributions: el.contributions,
      followers: el.followers,
      html_url: el.html_url,
      login: el.login,
      name: el.name
    }));
    mapped.sort((a, b) => (a.contributions > b.contributions ? -1 : b.contributions > a.contributions ? 1 : 0));
    top3Contributors.innerHTML = mapped
      .slice(0, 3)
      .map(
        val =>
          `<div>
    <i style="background-image:url('${val.avatar_url}')"></i>
    <a href="${val.html_url}">
    <span>${val.name}</span>
    <span>${val.login}</span>
    </a>
    <span>Magic spells casted: ${val.contributions}</span></div>`
      )
      .join("");
    console.log(orgevents);
    const latestActivity = document.querySelector("#activity");
    latestActivity.innerHTML = orgevents
      .map(x => {
        let type = x.type;
        let action = "";

        "PushEvent" === type &&
          (action = `     
        <span class="path">
        <a class="path-repo" href="https://github.com/repos/${x.repo.name}">${x.repo.name}</a>  
        </span>
        <span class="action-was-made">Pushed ${x.payload.size} commit to <a href="${x.repo.url}">${x.repo.name}</a></span>
        <span class="message"><pre class="message-inner">${x.payload.commits[0].message}</pre></span>`);

        "PullRequestEvent" === type &&
          (type = `${type}-${x.payload.action}`) &&
          (action = `
        <span class="path">
        <a class="path-repo" href="${x.payload.pull_request.head.repo.html_url}">${x.payload.pull_request.base.repo.name}</a>  
        <a class="path-pulls" href="${x.payload.pull_request.base.repo.html_url}/pulls"> /pulls/ </a>
        </span>
        <span class="action-was-made">${x.payload.action} a pull request <a href="${x.payload.pull_request.html_url}">${
            x.payload.pull_request.title
            }</a></span>        
        `);

        "PullRequestReviewCommentEvent" === type &&
          (action = `
        <span class="path">
        <a class="path-repo" href="${x.payload.pull_request.head.repo.html_url}">${x.payload.pull_request.head.repo.name}</a>  
        <a class="path-pulls" href="${x.payload.pull_request.html_url}/pulls"> /pulls/ </a>
        <a class="path-title" href="${x.payload.pull_request.html_url}">${x.payload.pull_request.title}</a>
        </span>
        <span class="action-was-made">${x.payload.action} a <a href="${x.payload.comment.html_url}">comment</a></span> 
        <span class="message"><pre class="message-inner">${x.payload.comment.body}</pre></span>`);

        "ForkEvent" === type &&
          (action = `
          <span class="path">
          <a class="path-repo" href="${x.repo.html_url}>${x.repo.name}</a> --> <a class="path-repo" href="${x.payload.forkee.html_url}>${
            x.payload.forkee.name
            }</a>
          </span>
          <span class="action-was-made">Forked a repo</span>`);

        "IssueCommentEvent" === type &&
          (action = `
          <span class="path">
          <a class="path-repo" href="${x.payload.issue.html_url}">${x.payload.issue.title}</a>  
          </span>
          
          <span class="action-was-made">Wrote a <a href="${x.payload.comment.html_url}">comment</a>
        <span class="message"><pre class="message-inner">${x.payload.comment.body}</pre></span>`);

        "WatchEvent" === type &&
          (action = `
          <span class="path">
          <a class="path-repo" href="https://github.com/${x.repo.name}">${x.repo.name}</a>  
          </span>

          <span class="action-was-made">Starred a repo</span>`);

        "DeleteEvent" === type &&
          (action = `
          <span class="path">
          <a class="path-repo" href="https://github.com/${x.repo.name}">${x.repo.name}</a>  
          </span>
          <span class="action-was-made">Deleted a ${x.payload.ref_type} "${x.payload.ref}"</span>`);

        "CreateEvent" === type &&
          (action = `
          <span class="path">
          <a class="path-repo" href="https://github.com/${x.repo.name}">${x.repo.name}</a>  
          </span>
          
          <span class="action-was-made">Created a ${x.payload.ref_type} "${
            x.payload.ref
            }" with description:</span><pre class="message-inner">${x.payload.description}</pre>`);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const orgEventTime = new Date(x.created_at);
        const time = `${orgEventTime.getDate()} ${
          monthNames[orgEventTime.getMonth()]
          } ${orgEventTime.getHours()}: ${`0${orgEventTime.getMinutes()}`.substr(-2)}`;

        return `
<div data-type="${type}">
  <i class="action-image"></i>
  <div class="action-user-wrapper">
      <i class="action-user-image " style="background-image:url( '${x.actor.avatar_url}') "></i>
      <span class="action-user-name ">${x.actor.login}</span>
</div>
      <div class="action-description-wrapper">
      <span>${action}</span>
      <span class="action-time">${time}</span>
    </div>
  </div>
      `;
      })
      .join("");
  }

  function drawRepositories(orgreposAndContributors) {
    const repositories = document.querySelector("#repositories");
    repositories.innerHTML = `
  <div class="repo-list">
  </div>
  `;
    const collator = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
    orgreposAndContributors.sort((a, b) => collator.compare(b.forks_count, a.forks_count));
    const repositoriesList = document.querySelector(".repo-list");
    repositoriesList.innerHTML = orgreposAndContributors
      .map(x => {
        let issues = "";
        let watchers = "";
        let forks = "";
        x.open_issues !== 0 &&
          (issues = `<i class="repo-issues"><span class="repo-images-text">${
            x.open_issues
            }</span><span class="tooltiptext">Dangerous Spells</span></i>`);
        x.watchers_count !== 0 &&
          (watchers = `<i class="repo-watchers"><span class="repo-images-text">${
            x.watchers_count
            }</span><span class="tooltiptext">Overwatchers</span></i>`);
        x.forks_count !== 0 &&
          (forks = `<i class="repo-forks"><span class="repo-images-text">${
            x.forks_count
            }</span><span class="tooltiptext">Copies</span></i>`);
        x.description == null && (x.description = "");

        let contributor = "";
        x.contributors !== undefined &&
          (contributor = x.contributors
            .map(
              x => `
    <span class="repo-contr"><a href="${x.html_url}"><i class="repo-contr-image" style="background-image:url(${
                x.avatar_url
                })"></i><span class="repo-contr-name">${x.login}</span></a><i class="repo-contr-contribs">${
                x.contributions
                }<span class="tooltiptext">Spells Casted</span></i></span>`
            )
            .join(""));
        return `<div class="repo">

    <span class="repo-name"><a href="${x.html_url}">${x.name}</a></span>
    <span class="repo-description">${x.description}</span>
    <span class="repo-images">
    ${issues}
    ${watchers}
    ${forks}
    </span>
    <span class="repo-contrs">${contributor}</span>
    </div>`;
      })
      .join("");
  }

  function drawContributors(orgusercontrs) {
    const contributors = document.querySelector("#contributors");
    contributors.innerHTML = `
  <div class="users-list">
  </div>
  `;
    const usersList = document.querySelector(".users-list");
    usersList.innerHTML = orgusercontrs
      .map(x => {
        x.location == null && (x.location = "");
        x.name == null && (x.name = "");
        x.login == null && (x.login = "");
        x.company == null && (x.company = "");
        x.blog == null && (x.blog = "");

        let contributions = "";
        let followers = "";
        let public_repos = "";
        let location = "";
        let company = "";
        let blog = "";

        x.contributions !== 0 &&
          (contributions = `<span class="user-images-text">${
            x.contributions
            }<i class="user-contributions"></i><span class="tooltiptext">Spells Casted</span></span>`);
        x.followers !== 0 &&
          (followers = `<span class="user-images-text">${
            x.followers
            } <i class="user-followers"></i><span class="tooltiptext">Marionettes Owned</span></span>`);
        x.public_repos !== 0 &&
          (public_repos = `<span class="user-images-text">${
            x.public_repos
            } <i class="user-public-repos"></i><span class="tooltiptext">White Books Owned</span></span>`);

        x.location !== "" && (location = `<span class="user-location">Location: ${x.location}</span>`);
        x.company !== "" && (company = `<span class="user-company">Company: ${x.company}</span>`);
        x.blog !== "" && (blog = `<span class="user-blog">Blog: <a href="${x.blog}">${x.blog}</a></span>`);

        return `<div class="user">
    <i class="user-avatar" style="background-image:url(${x.avatar_url})"></i>
    <span class="user-name"><a href="${x.html_url}">${x.name}</a></span>
        <span class="user-login">${x.login}</span>
        <span class="user-description">
        ${location}
                ${company}
                ${blog}
      </span>
    <span class="user-images">
${contributions}
${followers}
${public_repos}
    </span>
    </div>`;
      })
      .join("");
  }
}
