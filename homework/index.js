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
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  // function to create options with repository names and add to select element
  function addOptions(select, repoNames) {
    for (let i = 0; i < repoNames.length; i++) {
      const option = createAndAppend('option', select);
      option.innerText = repoNames[i];
    }
  }
  // function to get relevant information from the JSON for the div elements.
  // content gets four values: 'html_url', 'forks', 'updated_at', 'description'
  // repoName : name of repo about which we want to get information (selected option)
  function getDivContent(content, data, repoName, name = 'name') {
    const index = data.map(item => item[name]).indexOf(repoName);
    return data[index][content];
  }
  // function to change inner texts when we select new repository in the select item
  // this function is a little bit unnecessary. just did it for the sake of functional programming paradigm :)
  function changeInnerText(tagId, text) {
    document.getElementById(tagId).innerText = text;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        /* I didnt use the hint to sort the repository names. I just get this method from stack overflow.
         i made an array of repository names. and whenever I need other information about the 
        concerning repo (description, updated_at etc.), I reached them thru this repoNames array */

        const repoNames = data
          .map(item => item.name)
          .sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
          });

        const header = createAndAppend('header', root, { id: 'header' });
        const headerDiv = createAndAppend('div', header, { id: 'headerDiv' });
        createAndAppend('span', headerDiv, {
          text: 'HYF Repositories',
          id: 'headerSpan',
        });
        const select = createAndAppend('select', headerDiv, { id: 'selectId' });
        addOptions(select, repoNames);
        // to get the text(repo. name) from select element to be used to retrieve info about the selected repo
        let selectedOption = document.getElementById('selectId').options[
          document.getElementById('selectId').selectedIndex
        ].text;
        const repoDetailsDiv = createAndAppend('div', root, { id: 'repoDetailsDiv' });
        const repoDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const descriptionDiv = createAndAppend('div', repoDetailsDiv, {
          class: 'divClass',
          id: 'descDiv',
        });
        const forkDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });
        const updatedDiv = createAndAppend('div', repoDetailsDiv, { class: 'divClass' });

        createAndAppend('span', descriptionDiv, {
          id: 'descSpan',
          text: 'Description:',
          class: 'spanClass',
        });
        createAndAppend('span', forkDiv, {
          id: 'forkSpan',
          text: 'Forks:',
          class: 'spanClass',
        });
        createAndAppend('span', updatedDiv, {
          id: 'updateSpan',
          text: 'Updated:',
          class: 'spanClass',
        });
        createAndAppend('span', repoDiv, { id: 'repoSpan', text: 'Repository:' });
        createAndAppend('p', descriptionDiv, {
          id: 'descP',
          text: getDivContent('description', data, selectedOption),
          class: 'pClass',
        });
        createAndAppend('p', forkDiv, {
          id: 'forkP',
          text: getDivContent('forks', data, selectedOption),
          class: 'pClass',
        });
        createAndAppend('p', updatedDiv, {
          id: 'updateP',
          text: getDivContent('updated_at', data, selectedOption),
          class: 'pClass',
        });
        createAndAppend('a', repoDiv, {
          text: getDivContent('name', data, selectedOption),
          id: 'repoA',
          href: getDivContent('html_url', data, selectedOption),
          target: '_blank',
        });
        const selectA = document.getElementById('selectId');
        selectA.onchange = function func() {
          selectedOption = document.getElementById('selectId').options[
            document.getElementById('selectId').selectedIndex
          ].text;
          document.getElementById('repoA').href = getDivContent('html_url', data, selectedOption);
          document.getElementById('repoA').innerText = getDivContent('name', data, selectedOption);
          changeInnerText('descP', getDivContent('description', data, selectedOption));
          changeInnerText('forkP', getDivContent('forks', data, selectedOption));
          changeInnerText('updateP', getDivContent('updated_at', data, selectedOption));
          if (getDivContent('description', data, selectedOption) === null) {
            document.getElementById('descDiv').style.display = 'none';
          } else document.getElementById('descDiv').style.display = 'flex';
        };
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
