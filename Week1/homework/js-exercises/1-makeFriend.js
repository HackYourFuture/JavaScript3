/*Wouldn't it cool to make a new friend with just the click of a button?

Write a function that makes an API call to https://www.randomuser.me/api

Inside the same file write two functions: one with XMLHttpRequest, and the other with axios
Each function should make an API call to the given endpoint: https://www.randomuser.me/api
Log the received data to the console
Incorporate error handling */


const url = 'https://www.randomuser.me/api'

function makeFriend() { 
    const xhr = new XMLHttpRequest();
       
    xhr.responseType = 'json';
    
    xhr.onload = function () {
      if(xhr.status < 400){
        const friendData = xhr.response;
        console.log(friendData.results[0].name);

      }else {
        console.log("HTTP Error ", xhr.status);
      }
    }
    xhr.onerror = function() {
      console.log('Something went wrong.');
    }

    xhr.open('GET', url, true);
    xhr.send();
}
window.onload = function() {
  document.getElementById('myButton').onclick = function () {
    makeFriend();
  }
  document.getElementById('myButton2').onclick = function () {
    makeFriend2();
  }
}


// Make a request for a user with a given ID
function makeFriend2() {axios.get(url)
  .then(function (response) {
    // handle success
        console.log(response.data.results[0].name);
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

