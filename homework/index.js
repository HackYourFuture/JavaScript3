'use strict';

{
  function fetchJSON(url, cb) {
    const fetchingPromise = fetch(url)

    const dataPromise = fetchingPromise.then(res => {
      return res.json()
    })

    dataPromise.then(repos => {
      cb(null, repos)
    })
    dataPromise.catch(err => {
      cb(err)
    })

  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value; // used to create the name of the repository
      } else {
        elem.setAttribute(key, value); //creates a class.
      }
    });
    return elem;
  }

  // Point 1: creating HTML and CSS elements for the repositories and filling them with data.
  // since we want each repo to appear indivudually, a repo block was created. The block is defined in the main function
  function repoDetails(repoSegment, repo) {
    const createTable = createAndAppend('div', repoSegment, { class: 'block' });
    const repositoryRow = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', repositoryRow, { text: 'Repository:', class: 'bold-title' }); //name of the repo
    createAndAppend('a', repositoryRow, { text: repo.name, href: repo.html_url, target: '_blank' }); // details from the api link
    const descriptionRow = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', descriptionRow, { text: 'Description:', class: 'bold-title', });
    createAndAppend('span', descriptionRow, { text: repo.description });
    const forkRow = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', forkRow, { text: 'Fork:', class: 'bold-title' });
    createAndAppend('span', forkRow, { text: repo.fork });
    const updateRow = createAndAppend('div', createTable, { class: 'row' });
    createAndAppend('span', updateRow, { text: 'Update:', class: 'bold-title' });
    createAndAppend('span', updateRow, { text: repo.updated_at });
  }

  // Point 2: creating the HTML and CSS elements for the contributors.
  //contributorSegment will be created in the main function. then this function is called. 
  function contributorsInfo(contributorSegment, url) {
    fetchJSON(url, (err, contributors) => {
      if (err) {
        createAndAppend('div', contributorSegment, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }

      // if there is no error, create the segement for all contributor (may desplay flex later)
      const allCont = createAndAppend('div', contributorSegment, { class: 'all-cont' })

      // then sort the contributors and do the for each contributor 
      contributors.forEach(cont => {
        const eachCont = createAndAppend('div', allCont, { class: 'each-cont' })
        createAndAppend('img', eachCont, { src: cont.avatar_url, class: 'cont-avatar' }) // create the image
        const contDetails = createAndAppend('div', eachCont, { class: 'cont-details' }) // create the details div
        createAndAppend('a', contDetails, { text: cont.login, class: 'cont-name', href: cont.html_url, target: '_blank' }) // append details
        createAndAppend('a', contDetails, { text: cont.contributions, class: 'num-contributions' }) // # of contributions
      })
    })
  }

  function main(url) {
    const root = document.getElementById('root');
    fetchJSON(url, (err, repos) => {
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      // creating the header here to be able to loop through the select menu.
      const header = createAndAppend('div', root, { class: 'headerHYF' });
      createAndAppend('h2', header, { text: 'HYF Repositories' });
      const select = createAndAppend('select', header, { class: 'drop-menu' });

      repos
        .sort((a, b) => {
          return a.name.localeCompare(b.name); //copied from the documentation/ it is not needed now tho. 
        })
        .forEach((repo, index) => {  //index is defined here to be able to choose from the drop down menu below. 
          createAndAppend('option', select, { text: repo.name, value: index });
        });

      // here we are creating the segment div for the the repo and the contributor.
      const segment = createAndAppend('div', root, { class: 'segment' });
      const repoSegment = createAndAppend('div', segment, { class: 'repo-segment' });
      const contributorSegment = createAndAppend('div', segment, { class: 'contributor-segment' });

      // here we start creating the repo segments and fixing the first view just like requested.
      repoDetails(repoSegment, repos[0]);
      contributorsInfo(contributorSegment, repos[0].contributors_url)

      //finally changing the view depending on whats selected from the select drop down menu.
      select.onchange = function () {
        //first remove the set values above. 
        repoSegment.innerHTML = ''
        contributorSegment.innerHTML = ''
        // create new ones based on the selected item
        const index = select.value;
        repoDetails(repoSegment, repos[index]);
        contributorsInfo(contributorSegment, repos[index].contributors_url)
      }

    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
