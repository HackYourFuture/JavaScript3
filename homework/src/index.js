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

      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { 'html': '<h3> HYF Repositories <h3>' })


      const select = createAndAppend('select', header)
      const div = createAndAppend('div', root, { 'id': 'div1' })
      const div2 = createAndAppend('div', root, { 'id': 'div2' })


      if (err) {
        createAndAppend('p', div2, { html: err.message, class: 'alert-error' });
      } else {
        data.forEach((repo, index) => {
          const option = createAndAppend('option', select, { 'html': repo.name, 'value': index });
          // console.log(repo.name, index);

        });
        select.addEventListener('change', (event) => {
          const contrubutorsURL = data[event.target.value].contributors_url;
          div2.innerHTML = '';
          fetchJSON(contrubutorsURL, (err, contdata) => {



            data.sort((a, b) => a.name.localeCompare(b.name, 'fr', { ignorePunctuation: true }));
            contdata.forEach((contr) => {
              container2(contr)
            })





          })

        })






        select.addEventListener('change', (event) => {
          div.innerHTML = ''

          container1(data[event.target.value])



        })




        // createAndAppend('pre', root, { html: JSON.stringify(data, null, 2) });
      }
      function container1(repo) {

        const table = createAndAppend('table', div)
        const tr = createAndAppend('tr', table)
        const td1_1 = createAndAppend('td', tr, { 'html': 'Repository  : ', 'class': 'tr' })
        const td1_2 = createAndAppend('td', tr, { 'html': repo.name })


        const tr2 = createAndAppend('tr', table)
        const td2_1 = createAndAppend('td', tr2, { 'html': 'Description : ', 'class': 'tr' })
        const td2_2 = createAndAppend('td', tr2, { 'html': repo.description })

        const tr3 = createAndAppend('tr', table)
        const td3_1 = createAndAppend('td', tr3, { 'html': 'Forks : ', 'class': 'tr' })
        const td3_2 = createAndAppend('td', tr3, { 'html': repo.forks_count })


        const Date1 = new Date(repo.updated_at).toLocaleString();
        const tr4 = createAndAppend('tr', table)
        const td4_1 = createAndAppend('td', tr4, { 'html': 'Last update : ', 'class': 'tr' })
        const td4_2 = createAndAppend('td', tr4, { 'html': Date1 })
      }


      function container2(repo) {

        const div3 = createAndAppend('div', div2, { 'class': 'container' })


        createAndAppend('img', div3, { 'src': repo.avatar_url })
        createAndAppend('a', div3, { 'html': repo.login, 'href': repo.html_url })
        createAndAppend('p', div3, { 'html': repo.contributions, 'class': 'contributions' })







        // const table = createAndAppend('table', div2)
        // const tr = createAndAppend('tr', table)
        // const td1_1 = createAndAppend('td', tr, { 'html': '<img src =' + repo.avatar_url + ' >' })
        // const td1_2 = createAndAppend('td', tr, )




      }

    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
