/*
Write a function that makes a HTTP Request to https://dog.ceo/api/breeds/image/random. It should trigger after clicking a button in your webpage. Every time the button is clicked it should append a new dog image to the DOM.

Create an index.html file that will display your random image
Add 2 <button> and 1 <ul> element, either in the HTML or through JavaScript
Write two versions for the button functionality: one with XMLHttpRequest, and the other with axios
When any one of the 2 buttons is clicked it should make a HTTP Request to https://dog.ceo/api/breeds/image/random
After receiving the data, append to the <ul> a <li> that contains an <img> element with the dog image
Incorporate error handling: log to the console the error message
*/

//HTML elements:
const galleryList = document.getElementById('gallery');
const xmlBtn = document.getElementById('xmlBtn');
const axiosBtn = document.getElementById('axiosBtn');
//API
const url = 'https://dog.ceo/api/breeds/image/random';

//Getting dog image using XML:
function getDogPicXML() {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', url);

  xhr.onload = function () {
    if (xhr.status < 400) {
      const list = document.createElement('li');
      galleryList.appendChild(list);
      const dogImg = document.createElement('img');
      list.appendChild(dogImg);
      dogImg.src = xhr.response.message;
    } else {
      console.log('Error:', xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log('Something went wrong');
  };
  xhr.send();
}

/*
In all three excersises used different conditions to check xhr status, as there were given a lot of examples in reading and video materials, just to see if behavior would change.
*/

//Getting dog image using axios:
function getDogPicAxios() {
  axios
    .get(url)
    .then((response) => {
      const list = document.createElement('li');
      galleryList.appendChild(list);
      const dogImg = document.createElement('img');
      list.appendChild(dogImg);
      dogImg.src = response.data.message;
    })
    .catch((err) => console.log(err));
}

//Event listeners:
xmlBtn.addEventListener('click', getDogPicXML);
axiosBtn.addEventListener('click', getDogPicAxios);
