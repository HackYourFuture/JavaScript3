'use strict';

// normal method
const btnNormal = document.querySelector('#normal');

const randomDogNormal = () => {
  const xhr = new XMLHttpRequest();
  const url = 'https://dog.ceo/api/breeds/image/random';
  const ulEl = document.querySelector('#list');

  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const newList = document.createElement('li');
      const newImg = document.createElement('img');
      newImg.setAttribute('src', xhr.response.message);
      newList.appendChild(newImg);
      ulEl.appendChild(newList);
    } else {
      console.log(`${xhr.status}`);
    }
  };

  xhr.open('GET', url);
  xhr.send();
};
btnNormal.addEventListener('click', randomDogNormal);

//axios method

const btnAxios = document.querySelector('#axios');

const randomDogAxios = () => {
  const url = 'https://dog.ceo/api/breeds/image/random';
  const ulEl = document.querySelector('#list');

  axios
    .get(url)
    .then(function(response) {
      const newList = document.createElement('li');
      const newImg = document.createElement('img');
      newImg.setAttribute('src', response.data.message);
      newList.appendChild(newImg);
      ulEl.appendChild(newList);
    })
    .catch(function(error) {
      console.log(error);
    });
};
btnAxios.addEventListener('click', randomDogAxios);
