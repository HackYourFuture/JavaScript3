'use strict'

function getRandomUserXML(){
    const xhr = new XMLHttpRequest()
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status < 400) {
            console.log(xhr.response);
        } else {
            console.log('Error!', xhr.status);
        };
    };

    xhr.onerror = function() {
        console.log('Error!', xhr.status);
    };

    const url = 'https://www.randomuser.me/api'
    xhr.open('GET', url)
    xhr.send();
};

getRandomUserXML();


function getRandomUserAxios(){
  
    const url = `https://www.randomuser.me/api`
  
    axios.get(url)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
};


  
getRandomUserAxios();