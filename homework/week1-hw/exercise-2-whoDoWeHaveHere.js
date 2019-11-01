'use strict';
// Wouldn't it cool to make a new friend with just the click of a button?

// Write a function that makes an API call to https://www.randomuser.me/api

// Inside the same file write two functions: one with XMLHttpRequest, and the other with axios
// Each function should make an API call to the given endpoint: https://www.randomuser.me/api
// Log the received data to the console
// Incorporate error handling

const userUrl = 'https://www.randomuser.me/api';

(function getApiWithXHR(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () =>
    callback(null, { response: xhr.response, status: xhr.status });
  xhr.onerror = () => callback('Oops! An error occured.');
  xhr.send();
})(userUrl, (err, data) => {
  if (err !== null) {
    console.log(err);
  } else {
    if (data.status < 300 && data.status >= 200) console.log(data);
    else {
      console.log(`Error (load): ${data.response} status: ${data.status}`);
    }
  }
});

(function getApiWithAxios() {
  axios
    .get(userUrl)
    .then(response => console.log(response.data))
    .catch(err => console.log(err));
})();
