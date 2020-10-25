/*
Write a function that makes a HTTP Request to https://xkcd.now.sh/?comic=latest

Inside the same file write two programs: one with XMLHttpRequest, and the other with axios
Each function should make a HTTP Request to the given endpoint: https://xkcd.now.sh/?comic=latest
Log the received data to the console
Render the img property into an <img> tag in the DOM
Incorporate error handling: log to the console the error message
*/

const body = document.body;
const url = 'https://xkcd.now.sh/?comic=latest';

//XMLHttpRequest:
function getComicXML() {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', url);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      const image = document.createElement('img');
      body.appendChild(image);
      image.src = xhr.response.img;
      image.alt = xhr.response.alt;
    } else {
      console.log('Error:', xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log('Something went wrong');
  };
  xhr.send();
}
getComicXML();

// axios request:
function getComicAxios() {
  axios
    .get(url)
    .then((response) => {
      const newImage = document.createElement('img');
      body.appendChild(newImage);
      console.log(response.data);
      newImage.src = response.data.img;
      newImage.alt = response.alt;
    })
    .catch((err) => console.log(err));
}
getComicAxios();
