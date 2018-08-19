"use strict";
{
  function main() {
    fetchJSON("https://api.github.com/orgs/HackYourFuture/repos", (err, data) => {
      function rend(changeEvent) {
        main.innerHTML = "";
        let sectL = crnap("section", main, { class: "left", id: "maininfo" });
        const sectR = crnap("section", main, { class: "right", id: "contribInfo" });
        let sectLinfobox = crnap("div", sectL, { id: "info-box", class: "scy" });
        sectL = crnap("div", sectLinfobox, {
          html:
            null == changeEvent.full_name
              ? "No name"
              : `Repo name: <a href="${changeEvent.html_url}">${changeEvent.full_name}</a>`,
          class: "name"
        });
        crnap("div", sectLinfobox, {
          html:
            null == changeEvent.description
              ? "No description"
              : `Description: ${changeEvent.description}`,
          class: "description"
        });
        crnap("div", sectLinfobox, {
          html: null == changeEvent.forks ? "No forks" : `Forks: ${changeEvent.forks}`,
          class: "forks"
        });
        crnap("div", sectLinfobox, {
          html:
            null == changeEvent.updated_at
              ? "Update is unknown"
              : `Updated: ${new Date(changeEvent.updated_at).toLocaleString()}`,
          class: "updated"
        });
        sectLinfobox = crnap("div", sectLinfobox, {
          html: null == changeEvent.size ? "No size" : `Size: ${changeEvent.size}`,
          class: "size"
        });
        fetchJSON(changeEvent.contributors_url, (err, contributors) => {
          let fetchToDo = contributors.length;
          contributors.forEach(contributor => {
            fetchJSON(contributor.url, (err, user) => {
              Object.assign(contributor, user);
              --fetchToDo;
              0 === fetchToDo &&
                (console.log(contributors),
                  contributors.forEach(contrUser => {
                    let sectRcontrs = crnap("div", sectR, { id: "contributors" });
                    sectRcontrs = crnap("div", sectRcontrs, { class: "card" });
                    let secRimglink = crnap("a", sectRcontrs, { href: contrUser.html_url });
                    secRimglink = crnap("figure", secRimglink, {});
                    crnap("img", secRimglink, { src: contrUser.avatar_url });
                    crnap("h2", sectRcontrs, { html: null == contrUser.name ? "" : `name: ${contrUser.name}` });
                    crnap("p", sectRcontrs, { html: null == contrUser.login ? "" : `nickname: ${contrUser.login}` });
                    crnap("p", sectRcontrs, {
                      html: null == contrUser.location ? "" : `location: ${contrUser.location}`
                    });
                    crnap("p", sectRcontrs, {
                      html: null == contrUser.followers ? "" : `followers: ${contrUser.followers}`
                    });
                    crnap("p", sectRcontrs, {
                      html: null == contrUser.company ? "" : `company: ${contrUser.company}`
                    });
                    crnap("p", sectRcontrs, {
                      html: null == contrUser.contributions ? "" : `contributions: ${contrUser.contributions}`
                    });
                    crnap("p", sectRcontrs, {
                      html:
                        null == contrUser.updated_at
                          ? ""
                          : `last github visit: ${new Date(contrUser.updated_at).toLocaleString()}`
                    });
                  }));
            });
          });
        });
      }
      const root = document.getElementById("root");
      let header = crnap("header", root, {});
      header = crnap("div", header, { class: "selectfield" });
      const menu = crnap("select", header, { id: "selectmenu" });
      var main = crnap("main", root, { id: "main" });
      err
        ? crnap("div", root, { a: err.message, b: "alert-error" })
        : (data
          .sort((b, a) => b.name.localeCompare(a.name))
          .forEach((a, d) =>
            crnap("option", menu, { value: d, b: "select", html: a.name })
          ),
          menu.addEventListener("change", event => {
            event = event.target.value;
            rend(data[event]);
          }));
    });
  }
  function crnap(name, prnt, opts) {
    opts = void 0 === opts ? {} : opts;
    const elem = document.createElement(name);
    prnt.appendChild(elem);
    Object.keys(opts).forEach(key => {
      const val = opts[key];
      "html" === key ? (elem.innerHTML = val) : elem.setAttribute(key, val);
    });
    return elem;
  }
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = () => {
      400 > xhr.status
        ? cb(null, xhr.response)
        : cb(Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
    };
    xhr.onerror = () => cb(Error("Network request failed"));
    xhr.send();
  }
  window.onload = () => main();
}
