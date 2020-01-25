
'use strict';

// one with XMLHttpRequest()

const btnNormal = document.querySelector('#normal');

const randomDogNormal = () => {
  const xhr = new XMLHttpRequest();
  const ul = document.querySelector('#ulList');

  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.setAttribute('src', xhr.response.message);
      li.appendChild(img);
      ul.appendChild(li);
    } else {
      console.log(`${xhr.status}`);
    }
  };

  xhr.open('GET', 'https://dog.ceo/api/breeds/image/random');
  xhr.send();
};
btnNormal.addEventListener('click', randomDogNormal);

// and the other with :
// axios

const btnAxios = document.querySelector('#axios');

const randomDogAxios = () => {
  const ul = document.querySelector('#ulList');

  axios.get('https://dog.ceo/api/breeds/image/random')
  
    .then(function(response) {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.setAttribute('src', response.data.message);
      li.appendChild(img);
      ul.appendChild(li);
    })
    .catch(function(error) {
        console.log('there are some errors', error);
    })
    .finally(function(){
        console.log('let me know what happend')
    })
};
btnAxios.addEventListener('click', randomDogAxios);