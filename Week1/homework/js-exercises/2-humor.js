/* Exercise 2: Programmer humor

Who knew programmers could be funny?

Write an function that makes an API call to https://xkcd.now.sh/?comic=latest

Inside the same file write two programs: one with XMLHttpRequest, and the other with axios
Each function should make an API call to the given endpoint: https://xkcd.now.sh/?comic=latest
Log the received data to the console
Render the img property into an <img> tag in the DOM
Incorporate error handling*/

const url = 'https://xkcd.now.sh/?comic=latest';
const img = document.getElementById("img");

function humor() { 
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function () {
      if(xhr.status < 400){
        const data = xhr.response;
        console.log(data.img);
        const src = document.createAttribute("src"); 
        src.value = data.img;          
        img.setAttributeNode(src);

      }else {
        console.log("HTTP Error ", xhr.status);
      }
    }
    xhr.open('GET', url);
    xhr.send();
} 

// Make a request for a user with a given ID
function humor2() {axios.get(url)
  .then(function (response) {
    // handle success
    console.log(response.data.img);
    const src = document.createAttribute("src"); 
    src.value = response.data.img;          
    img.setAttributeNode(src);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
    console.log('Alles klaar!');

  });
}


humor();
humor2();