'use strict';


function fetchJSON(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(xhr.statusText));
      }
    }
  };
  xhr.send();
}

function main() {
  const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";


  fetchJSON(url, (err, data) => {
    if (err) {
      console.error(err.message);
    } else {
      //console.log(data); this part is replaced by the one below; render(data)
      render(data);
    }
  });
}
function render(repos) {
  // gets the <div> with the id of 'root' from index.html
  const root = document.getElementById('root');
  //const jsonText = JSON.stringify(data, null, 2);
  const ul = document.createElement('ul');
  root.appendChild(ul);
  //pre.innerHTML = jsonText;

  repos.forEach(repo => {
    const li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML = repo.name
  });
}


//I think here I should create a function that will render an innerHTML right?


function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'html') {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

window.onload = main; 
