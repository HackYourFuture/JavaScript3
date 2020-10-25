/*
Write a function that makes a HTTP Request to https://www.randomuser.me/api

Inside the JavaScript file write two functions: one with XMLHttpRequest, and the other with axios
Each function should make a HTTP Request to the given endpoint: https://www.randomuser.me/api
Log the received data to the console
Incorporate error handling: log to the console the error message
*/

//global variable since both functions will use it
const url = 'https://www.randomuser.me/api';

//XMLHttpRequest:
function getRandomUserXML() {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', url);

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
      console.log(xhr.response);
    } else {
      console.log('Error:', xhr.status);
    }
  };
  xhr.onerror = function () {
    console.log('Something went wrong');
  };
  xhr.send();
}
getRandomUserXML();

//axios request:

function getRandomUserAxios() {
  axios
    .get(url)
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
}
getRandomUserAxios();
