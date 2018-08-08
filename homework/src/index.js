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
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {

      //blue part of the page
      const root = document.getElementById('root');

      createAndAppend('div', root, { id: 'myheading' });

      const myHeading = document.getElementById('myheading');

      createAndAppend('label', myHeading, { html: 'HYF Repositories ', class: 'rep-select' });

      createAndAppend('select', myHeading, { class: 'rep-select', id: 'selectID' });

      const select = document.getElementById('selectID');

      if (err) {
        createAndAppend('div', root, { html: err.message, class: 'alert-error' });
      } else {

        data.sort((a, b) => a.name.localeCompare(b.name));

        data.forEach((obj) => { createAndAppend('option', select, { html: obj['name'], class: 'rep-names' }); });


        //info-box of the page
        function showDetails() {

          //maybe there is more effective way but I couldnt find it
          //that's why, firstly I found the index of the object of the selected repo
          const num = data.findIndex(i => i.name === select.value);

          //this is an object constructor.
          function createDetail() {

            //then I used the index in order to fetch the other details of the selected repo
            this.Description = data[num]['description'];
            this.Forks = data[num]['forks'];
            let someDate = new Date(data[num]['updated_at']);
            this.Updated = someDate.toLocaleString();
          }

          //the object contains all details of selected repo except repository name.
          //you can see the repo name below
          const details = new createDetail();

          //first of all I created a table element and then I identified it with a variable
          createAndAppend('table', root, { id: 'info-box' });

          const infoBox = document.getElementById('info-box');

          //secondly I created a tbody element and then I identified it with a variable
          createAndAppend('tbody', infoBox, { id: 'info-body' });

          const tBody = document.getElementById('info-body');

          //thirdly I create a tr element for repo name.
          //the repo name is different from other details of the selected repo.
          //because there must be a link in the repo name.
          createAndAppend('tr', tBody, { id: 'tr1' });

          const tr1 = document.getElementById('tr1');

          //in the tr, first data is: below
          createAndAppend('td', tr1, { html: 'Repository:', id: 'td1', class: 'keys' });

          //in the tr, second data:
          createAndAppend('td', tr1, { id: 'td2', class: 'values' });

          const td2 = document.getElementById('td2');

          //I created 'a' element inside of second td element
          createAndAppend('a', td2, { href: data[num]['html_url'], html: data[num]['name'] });

          //this function creates and appends all details in the 'details' object
          Object.keys(details).forEach((key) => {
            const value = details[key];
            createAndAppend('tr', tBody, { id: `row-${key}`, class: 'rows' });
            const tr = document.getElementById(`row-${key}`);
            createAndAppend('td', tr, { html: key + ':', class: 'keys' });
            createAndAppend('td', tr, { html: value, class: 'values' });
          });
        };

        //when the page open at the beginning, the details of the already selected repo should be there
        showDetails();

        //when s.o. change the selected repo, the details of the just selected repo should be there in every time
        select.addEventListener('change', function () {

          //while s.o. is changing selected repo, there is previous details on the page.
          //thats why, first of all I must remove it
          const myTable = document.querySelector('#info-box');
          myTable.remove();

          //and then show the details of newly selected repo
          showDetails();
        });
      }
    });


  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
