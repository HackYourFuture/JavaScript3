'use strict';

{

  const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
  function main() {
    fetchJSON(url, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data);
      }
    });
  }



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
  window.onload = main;
} //Here ends the API url and callback settings.



