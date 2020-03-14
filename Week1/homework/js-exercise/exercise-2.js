/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const xhr = new XMLHttpRequest();
//const axios = require('axios');

const fetchURL = 'https://xkcd.now.sh/?comic=614';

function fetchXhr() {
  xhr.open('GET', fetchURL);
  xhr.responseType = 'json';
  // eslint-disable-next-line consistent-return
  xhr.onload = () => {
    console.log(xhr.response.img);
    document.getElementById('homeXhr').src = xhr.response.img;
  };
  xhr.send();
}

fetchXhr();

function fetchAxios() {
  axios
    .get(fetchURL)
    .then(response => {
      console.log(response.data);
      document.getElementById('home2').src = response.data.img;
    })
    .catch(error => {
      console.log(error);
    });
}

fetchAxios();
