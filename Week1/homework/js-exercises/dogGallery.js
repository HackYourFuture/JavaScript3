'use strict';

// Create button elements for XML and AXIOS
const btn1 = document.createElement('button');
const btn2 = document.createElement('button');
const ulElement = document.createElement('ul'); // This holds dog pictures (li elements)
const divElement = document.createElement('div'); // This holds the request buttons
btn1.className = 'xml-btn'; // for styling purposes
btn2.className = 'axios-btn';
btn1.innerHTML = 'Get a XML dog!';
btn2.innerHTML = 'Get an AXIOS dog!';
divElement.appendChild(btn1); // Get buttons inside div
divElement.appendChild(btn2);
document.body.appendChild(divElement);
const url = 'https://dog.ceo/api/breeds/image/random'; // shorthand for api

// XMLHttp Request to get dog image (light blue button)
function getXmlDog() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url); // I believe the true parameter is set by default
  xhr.send();
  xhr.onload = () => {
    // In one of the videos, onload is after send, though other examples show different order. Does it make a difference?
    let dogImg = JSON.parse(xhr.responseText); // get response parsed to a JS object and access it when condition is met (status ok)
    if (xhr.status === 200) {
      const liElements = document.createElement('li'); // to hold dog pictures
      liElements.innerHTML = `<img src="${dogImg.message}" width="150px">`;
      ulElement.appendChild(liElements);
      ulElement.style.listStyle = 'none';
      document.body.appendChild(ulElement); // add list of images to body
    } else {
      divElement.innerHTML = `Error: ${xhr.status}`; // will output error + status code
    }
  };
}

function getAxiosDog() {
  axios
    .get(url)
    .then(function(getResponse) {
      // arg is the parsed (to JS) object that contains another obj called 'data' which holds a key of 'message' and its value is URL for dog imgs
      const liElements = document.createElement('li');
      liElements.innerHTML = `<img src="${getResponse.data.message}" width="150px">`; // will output the object containing the url
      ulElement.appendChild(liElements);
      ulElement.style.listStyle = 'none';
      document.body.appendChild(ulElement);
    })
    .catch(function(error) {
      divElement.innerHTML = error;
    });
}

btn1.addEventListener('click', getXmlDog);
btn2.addEventListener('click', getAxiosDog);
