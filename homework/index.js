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

  function defaultSelectedRepository(data, selectedText) {
    let elem;
    data.filter(element => {
      if (element.name === selectedText) {
        elem = element;
      }
      return elem;
    });
    return elem;
  }

  function buildHtml(data, root) {
    const header = createAndAppend('header', root, { class: 'header' });
    createAndAppend('p', header, { text: 'HYF Repositories' });
    const select = createAndAppend('select', header, {
      class: 'repo-selector',
      arialabel: 'HYF Repositories',
    });

    data
      .map(repository => repository.name)
      .sort((a, b) => a.localeCompare(b, { caseFirst: 'lower' }))
      .map((element, index) => createAndAppend('option', select, { value: index, text: element }));

    const container = createAndAppend('div', root, { id: 'container' });
    const leftDiv = createAndAppend('div', container, { class: 'left-div whiteframe' });
    const table = createAndAppend('table', leftDiv);
    const tbody = createAndAppend('tbody', table, { id: 'tbody' });

    const defaultRepo = defaultSelectedRepository(data, select[select.selectedIndex].text);

    function showSelectedConts(dataCont) {
      const rightDiv = createAndAppend('div', container, {
        id: 'rightDiv',
        class: 'right-div whiteframe',
      });
      createAndAppend('p', rightDiv, {
        class: 'contributor-header',
        text: 'Contributions :',
      });
      const ul = createAndAppend('ul', rightDiv, { id: 'ulList', class: 'contributor-list' });
      dataCont.forEach(element => {
        const li = createAndAppend('li', ul, {
          class: 'contributor-item',
          arialabel: element.login,
          tabindex: 0,
        });
        createAndAppend('img', li, {
          src: element.avatar_url,
          height: 48,
          class: 'contributor-avatar',
        });
        const contInfoDiv = createAndAppend('div', li, { class: 'contributor-data' });
        createAndAppend('div', contInfoDiv, { text: element.login });
        createAndAppend('div', contInfoDiv, {
          class: 'contributor-badge',
          text: element.contributions,
        });
        li.addEventListener('click', () => {
          window.open(element.html_url, '_blank');
        });
      });
    }
    fetchJSON(defaultRepo.contributors_url, (err, contributors) => {
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        showSelectedConts(contributors);
      }
    });

    function showSelectedRepo(selectedRepo) {
      if (selectedRepo.name !== null) {
        const tr1 = createAndAppend('tr', tbody);
        createAndAppend('td', tr1, { class: 'label', text: 'Repository :' });
        const td2 = createAndAppend('td', tr1);
        const repoLink = createAndAppend('a', td2, { href: '', target: '_blank', text: '' });
        repoLink.textContent = selectedRepo.name;
        repoLink.href = selectedRepo.html_url;
      }
      if (selectedRepo.description !== null) {
        const tr2 = createAndAppend('tr', tbody);
        createAndAppend('td', tr2, { class: 'label', text: 'Description :' });
        const repoDescription = createAndAppend('td', tr2, { text: '' });
        repoDescription.textContent = selectedRepo.description;
      }
      if (selectedRepo.forks !== null) {
        const tr3 = createAndAppend('tr', tbody);
        createAndAppend('td', tr3, { class: 'label', text: 'Forks :' });
        const fork = createAndAppend('td', tr3, { text: '' });
        fork.textContent = selectedRepo.forks;
      }
      if (selectedRepo.updated_at !== null) {
        const tr4 = createAndAppend('tr', tbody);
        createAndAppend('td', tr4, { class: 'label', text: 'Updated :' });
        const updated = createAndAppend('td', tr4, { text: '' });
        updated.textContent = new Date(selectedRepo.updated_at).toLocaleString();
      }
    }
    showSelectedRepo(defaultRepo);

    select.addEventListener('change', () => {
      const selectedText = select[select.selectedIndex].text;
      let elem;
      data.filter(element => {
        if (element.name === selectedText) {
          elem = element;
        }
        return elem;
      });

      const tBody = document.getElementById('tbody');

      tBody.firstChild.lastChild.removeChild(tBody.firstChild.lastChild.firstChild);
      tBody.firstChild.removeChild(tBody.firstChild.lastChild);
      tBody.firstChild.removeChild(tBody.firstChild.firstChild);
      tBody.removeChild(tBody.firstChild);

      while (tBody.hasChildNodes()) {
        tBody.firstChild.removeChild(tBody.firstChild.firstChild);
        tBody.firstChild.removeChild(tBody.firstChild.lastChild);
        tBody.removeChild(tBody.firstChild);
      }

      const ulList = document.getElementById('ulList');
      while (ulList.hasChildNodes()) {
        ulList.firstChild.removeChild(ulList.firstChild.firstChild);
        ulList.firstChild.lastChild.removeChild(ulList.firstChild.lastChild.firstChild);
        ulList.firstChild.lastChild.removeChild(ulList.firstChild.lastChild.lastChild);
        ulList.firstChild.removeChild(ulList.firstChild.lastChild);
        ulList.removeChild(ulList.firstChild);
      }
      const containerDiv = document.getElementById('container');
      containerDiv.lastChild.removeChild(containerDiv.lastChild.firstChild);
      containerDiv.lastChild.removeChild(containerDiv.lastChild.lastChild);
      containerDiv.removeChild(container.lastChild);

      showSelectedRepo(elem);

      fetchJSON(elem.contributors_url, (err, contributors) => {
        if (err) {
          createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        } else {
          showSelectedConts(contributors);
        }
      });
    });
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        buildHtml(data, root);
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
