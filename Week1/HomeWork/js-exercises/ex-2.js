'use strict';

// one with XMLHttpRequest

const humorRequest = () => {
    const xhr = new XMLHttpRequest();
    
    const img = document.querySelector('#img');
  
    xhr.responseType = 'json';
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.response);
        img.setAttribute('src', xhr.response.img);
      } else {
        console.error();
      }
    };
    xhr.open('GET', 'https://xkcd.now.sh/?comic=614 ');
    xhr.send();
  };

  humorRequest();
  
// and the other with :
// axios
  
  const requestHumor = () => {

    const img = document.querySelector('#img');
  
    axios
      .get('https://xkcd.now.sh/?comic=614')

      .then(function(response) {
        console.log('this apparently was seccesfull',response);
        img.setAttribute('src', response.data.img);
      })
      .catch(function(error) {
        console.log('there are some errors', error);
      })
      .finally(function(){
        console.log('let me know what happend')
      })
  };
  requestHumor();