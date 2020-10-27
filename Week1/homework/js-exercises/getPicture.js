'use strict'

function getPictureXML(){
    const xhr = new XMLHttpRequest()
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status < 400) {
            console.log(xhr.response);
            let image = xhr.response.img
            let imageElement = document.createElement('img')
            document.body.appendChild(imageElement)
            imageElement.src = image
    
        } else {
            console.log('Error!', xhr.status)
        }
    }

    xhr.onerror = function() {
        console.log('Error!', xhr.status )
    }

    const url = 'https://xkcd.now.sh/?comic=latest'
    xhr.open('GET', url)
    xhr.send()
};

getPictureXML();




function getPictureAxios(){
  
    const url = `https://xkcd.now.sh/?comic=latest`
  
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


  
  