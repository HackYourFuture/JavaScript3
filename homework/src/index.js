'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      createAndAppend("div", root, { id: "top" });
      createAndAppend("div", root, { id: "left" });
      createAndAppend("div", root, { id: "right" });
      const top = document.getElementById('top');
      const left = document.getElementById('left');
      let right = document.getElementById('right');
      createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });

      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } //else {
      //   createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
      //  }

      data.sort((a, b) => a.name.localeCompare(b.name));
      
      createAndAppend("h7", top, { id: "title", text: "HYF-Repository" });
      createAndAppend("select", top, { id: "select" });

      createAndAppend("div", left, { id: "left1" });
      createAndAppend("h7", left1, { id: "repository", text: "Repository: ", class: "headings first" });
      createAndAppend("h7", left1, { id: "repositoryName", class: "txt first" });
      let repositoryName = document.getElementById("repositoryName")

      createAndAppend("div", left, { id: "left2" });
      createAndAppend("h7", left2, { id: "description", text: "Description: ", class: "headings first" });
      createAndAppend("p", left2, { id: "descriptionText", class: "txt first" });
      let descriptionText = document.getElementById("descriptionText")

      createAndAppend("div", left, { id: "left3" });
      createAndAppend("h7", left3, { id: "forkNumber", text: "Forks: ", class: "headings first" });
      createAndAppend("h7", left3, { id: "forkText", class: "txt first" });
      let forkText = document.getElementById("forkText")

      createAndAppend("div", left, { id: "left4" });
      createAndAppend("h7", left4, { id: "update", text: "Updated: ", class: "headings first" });
      createAndAppend("h7", left4, { id: "updateText", class: "txt first" });
      let updateText = document.getElementById("updateText")


      let repoName = [];
      let repoDecription = [];
      let repoForks = [];
      let repoUpdate = [];
      let repoContributorsLinks = [];
      // filling the arrays with data from the JSON file
      for (let i = 0; i < data.length; i++) {
        repoName.push(data[i].name);
        repoDecription.push(data[i].description);
        repoForks.push(data[i].forks);
        repoUpdate.push(data[i].updated_at)
        repoContributorsLinks.push(data[i].contributors_url)
      }

      selectOptions(repoName)


      let select = document.getElementById("select");
      select.addEventListener("change", function (e) {
        let option = this.options[this.selectedIndex].value;
        printRepoInfo(repoContributorsLinks, option, repoName, repoDecription, repoForks, repoUpdate)
        const i = e.target.value;
        getContributors(right, data[i])
      }); // end eventlistener
    }); // end of fetch()
  } //end of main fucntion

  // get all the array`s elements, insert them as options in the Select and give them the value of the indexnumber as ID
  function selectOptions(name) {
    let select = document.getElementById("select");

    for (let i = 0; i < name.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = name[i];
      select.appendChild(option);
    }
  }

  function printRepoInfo(arr, option, name, description, forks, update) {
    for (let i = 0; i < arr.length; i++) {
      if (option == i) {
        repositoryName.innerHTML = "<a href= '#' target='_blank'>" + name[i] + "</a>";
        descriptionText.innerHTML = description[i];
        forkText.innerHTML = forks[i]
        updateText.innerHTML = update[i];
      } // end if   
    } // end for   
  } // end function

  function getContributors(right, data) {
    right.innerHTML = "";
    createAndAppend("h5", right, { text: "Contributions", "class": "rightTitle" });
    fetchJSON(data.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend("div", right, { html: err.message, "class": "alert-error" });
      }
      contributors.map(c => {
        let ul = createAndAppend("ul", right, { "class": "ul" });
        let li = createAndAppend("li", ul, { "class": "li" });
        
        createAndAppend("img", li, { "class": "avatar", "src": c.avatar_url });
        
        let login = createAndAppend("div", li, { id: "login", "class": "liDivs" });
        const a = createAndAppend("a", login, { "target": "_blank", "href": c.html_url, "class": "link" });
        createAndAppend("h8", a, { text: c.login});
      
        let contributionsNumber = createAndAppend("div", li, { id: "contributionsNumber", "class": "liDivs" });
        createAndAppend("h8", contributionsNumber, { text: c.contributions});
      });
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}


