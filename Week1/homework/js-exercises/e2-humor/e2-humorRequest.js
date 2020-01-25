'use strict';

// normal method

const humorRequest = () => {
  const xhr = new XMLHttpRequest();
  const url = 'https://xkcd.now.sh/?comic=614 ';
  const imgEl = document.querySelector('#img');

  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      imgEl.setAttribute('src', xhr.response.img);
    } else {
      console.error();
    }
  };
  xhr.open('GET', url);
  xhr.send();
};
humorRequest();

// axios

const requestHumor = () => {
  const url = 'https://xkcd.now.sh/?comic=614 ';
  const imgEl = document.querySelector('#img');

  axios
    .get(url)
    .then(function(response) {
      console.log(response);
      imgEl.setAttribute('src', response.data.img);
    })
    .catch(function(error) {
      console.log(error);
    });
};
requestHumor();
