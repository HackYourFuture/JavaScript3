'use strict';

const xmlBtn = document.getElementById('xml');
const axiosBtn = document.getElementById('axios');

// XMLHTTP Request
const xmlHttpRequest = function() {
  // Create new XML constructor
  const xhr = new XMLHttpRequest();
  const url = 'https://www.randomuser.me/api';

  // initialize request
  xhr.open('GET', url);

  // send request over
  xhr.send();

  xhr.onload = function() {
    // output response if successful
    if (xhr.status === 200) {
      const json = JSON.parse(xhr.responseText); // will retrieve JS object (similar to AXIOS')
      console.log(json.results[0].name); // username position
    } else {
      // output error if request fails
      console.error(`Error ${xhr.status}`);
    }
  };
};

// Axios HTTP request
const axiosRequest = function() {
  axios
    .get('https://www.randomuser.me/api')
    .then(function(succ) {
      console.log(succ.data.results[0].name); // will display response if successful
    })
    .catch(function(err) {
      console.error(err); // will output the error message
    });
};

xmlBtn.addEventListener('click', xmlHttpRequest);
axiosBtn.addEventListener('click', axiosRequest);
