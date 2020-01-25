'use strict';

//normal method

const button = document.querySelector('#btn');

const serverRequest = () => {
  const xhr = new XMLHttpRequest();
  const url = 'https://www.randomuser.me/api';

  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    } else {
      console.error();
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

button.addEventListener('click', serverRequest);

//axios

const axiosRequest = () => {
  const url = 'https://www.randomuser.me/api';
  axios
    .get(url)
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
};
