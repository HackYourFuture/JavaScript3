'use strict';

// inside the same file write two functions:
// one with XMLHttpRequest()

const button = document.querySelector('#btn');

const serverRequest = () => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    } else {
      console.error();
    }
  };
  xhr.open('GET', 'https://www.randomuser.me/api');
  xhr.send();
};

button.addEventListener('click', serverRequest);

// and the other with :
// axios

const axiosRequest = () => {
  
  axios.get('https://www.randomuser.me/api')

    .then(function(response) {
      console.log('this apparently was seccesfull',response.data);
    })
    .catch(function(error) {
      console.log('there are some errors',error);
    })
    .finally(function(){
        console.log('let me know what happend')
    })
};