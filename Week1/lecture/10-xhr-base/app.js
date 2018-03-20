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

  const url = API.endpoints.laureate + API.queries[0].queryString;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        console.log(xhr.response);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.send();
}
