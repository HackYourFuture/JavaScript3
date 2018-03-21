'use strict';
{
  const API = {
    endpoints: {
      laureate: 'http://api.nobelprize.org/v1/laureate.json?',
      prize: 'http://api.nobelprize.org/v1/prize.json?'
    },
    queries: [
      {
        description: 'All female laureates',
        endpoint: 'laureate',
        queryString: 'gender=female'
      }
    ]
  };

  function main() {
    const url = API.endpoints.laureate + API.queries[0].queryString;

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
}
