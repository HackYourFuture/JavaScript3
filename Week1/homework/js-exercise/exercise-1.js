const xhr = new XMLHttpRequest();
const axios = require('axios');

const fetchURL = 'https://www.randomuser.me/api';

const fetchXhr = (url, callback) => {
  xhr.responseType = 'json';

  xhr.open('GET', fetchURL);
  xhr.onload = () => {
    callback(null, {
      response: xhr.response,
      status: xhr.status,
      readyState: xhr.readyState,
    });
  };
  xhr.onerror = () => callback(new Error('Network request failed'));
  xhr.send();
};

fetchXhr(fetchURL, (err, data) => {
  if (!err) {
    console.log(data.response);
  } else {
    console.log(err);
  }
});

const fetchAxios = () => {
  axios
    .get(fetchURL)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

fetchAxios();
