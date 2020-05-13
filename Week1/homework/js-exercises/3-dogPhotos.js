/* Dog photo gallery

Let's make a randomized dog photo gallery!
Write a function that makes an API call to https://dog.ceo/api/breeds/image/random. 
It should trigger after clicking a button in your webpage. Every time the button is 
clicked it should append a new dog image to the DOM.
Create an index.html file that will display your random image
Add 2 <button> and 1 <ul> element, either in the HTML or through JavaScript
Write two versions for the button functionality: one with XMLHttpRequest, and the other with axios
When any one of the 2 buttons is clicked it should make an API call to https://dog.ceo/api/breeds/image/random
After receiving the data, append to the <ul> a <li> that contains an <img> element with the dog image
Incorporate error handling */


//console.log("button");
const url = 'https://dog.ceo/api/breeds/image/random';
const body = document.querySelector('body');
const ul = document.createElement('ul');
const click1 = document.querySelector('button');
body.appendChild(ul);

function dogCall() {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = () => {
      if(xhr.status < 400){
        const data = xhr.response;
        console.log(data.message);
        const ul = document.querySelector('ul');
        const li = document.createElement('li');
        li.innerHTML += `<img src="${data.message}">`;
        ul.appendChild(li);
      } else {
        console.log("Error", xhr.statusText);
      }
    };
    xhr.open('GET', url);
    xhr.send();
}

function dogCallAxios() {axios.get(url)
  .then(function (response) {
    // handle success
    console.log(response.data);
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.innerHTML += `<img src="${response.data.message}">`;
    ul.appendChild(li);
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