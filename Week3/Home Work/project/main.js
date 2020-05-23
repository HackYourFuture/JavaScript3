"use strict";

const repoPart = document.querySelector(".repo-container");
const repoList = createAndAppend("ul", repoPart);
const contSection = document.querySelector(".contributors-container");
const ulCont = createAndAppend("ul", contSection, {
  class: "ulCont"
});
const select = document.getElementById("select");

async function fetchJSON(url) {
  try {
    const res = await axios.get(url);
    if (res.status > 299) {
      throw new Error();
    }
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
}

async function main(url) {
  try {
    const res = await fetchJSON(url);
    const repos = res.sort((repoA, repoB) => {
      return repoA.name.localeCompare(repoB.name);
    });
    selectionFactory(res);
    select.addEventListener("change", () => {
      //rendering the containers' data when the selected option(repo) has been changed
      renderRepoDetails(repos[select.value], repoList);
      renderRepoContributors(repos[select.value], ulCont);
    });
    renderRepoDetails(repos[select.value], repoList);
    renderRepoContributors(repos[select.value], ulCont);
  } catch (error) {
    errorHandler(error);
  }
}

// adding repo names to the select element as options
function selectionFactory(repos) {
  repos.forEach(repo => {
    const option = createAndAppend("option", select);
    option.innerText = repo.name;
    option.value = repos.indexOf(repo);
    select.appendChild(option);
  });
}
function errorHandler(err) {
  createAndAppend("div", root, {
    text: err.message,
    class: "alert-error"
  });
}

//function to create elements and append them to desired sections
function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "text") {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

//rendering the repo data to show repo section
function renderRepoDetails(repo, ul) {
  ul.innerHTML = "";
  //creating li item for repository name
  const repoLi = createAndAppend("li", ul, {
    text: "Repository: ",
    class: "bold"
  });
  //creating a link for repository name
  createAndAppend("a", repoLi, {
    text: repo.name,
    href: repo.html_url,
    target: "_blank"
  });
  //creating li for description of the repository
  createAndAppend("li", ul, {
    text: `Description: ${repo.description}`
  });
  //creating li for forks of the repository
  createAndAppend("li", ul, {
    text: `Forks: ${repo.forks}`
  });
  //creating li for last update time of the repository
  createAndAppend("li", ul, {
    text: `"Updated: " ${repo.updated_at}`
  });
}

//rendering the contributors data
async function renderRepoContributors(repo) {
  try {
    const contUrl = repo.contributors_url;
    const contributors = await fetchJSON(contUrl);
    createContributorSection(contributors);
  } catch (error) {
    errorHandler(error);
  }
}

//create the contributors section
function createContributorSection(contributors) {
  // const contributors = res.data;
  ulCont.innerHTML = "";
  createAndAppend("li", ulCont, {
    text: "Contributions",
    class: "headercontributors"
  });
  contributors.forEach(contributor => {
    const li = createAndAppend("li", ulCont, {
      class: "liCont"
    });
    createAndAppend("img", li, {
      src: contributor.avatar_url
    });
    createAndAppend("a", li, {
      text: contributor.login,
      href: contributor.html_url,
      target: "_blank"
    });
    createAndAppend("div", li, {
      text: contributor.contributions
    });
  });
}


const HYF_REPOS_URL =
  "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
window.onload = () => main(HYF_REPOS_URL); //attaching the main function to onload event listener