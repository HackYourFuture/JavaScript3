'use strict';
// Who doesn't love kittens on their screen?

// Write an function that makes an API call to https://wwww.placekitten.com/api

// Inside the same file write two programs: one with XMLHttpRequest, and the other with axios
// Each function should make an API call to the given endpoint: https://wwww.placekitten.com/api
// Log the received data to the console
// Incorporate error handling

const kittenUrl = 'https://wwww.placekitten.com/api';
(function getApiWithXMLHttpRequest(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () =>
    callback(null, { response: xhr.response, status: xhr.status });
  xhr.onerror = () => callback('There is an error!');
  xhr.send();
})(kittenUrl, kittenCallback);

function kittenCallback(err, data) {
  if (err) {
    console.log(err);
  } else {
    if (data.status >= 200 && data.status < 300) {
      console.log(data.response);
    } else {
      console.log(
        'Error (onload): ' + data.response + ' status: ' + data.status,
      );
    }
  }
}

(function getApiWithAxios() {
  axios
    .get(kittenUrl)
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
})();
