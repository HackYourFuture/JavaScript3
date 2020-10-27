'use strict';

const url = 'https://xkcd.now.sh/?comic=latest';
const imgTag = document.createElement('img');
const div = document.getElementById('photo-container');

function callXml() {
  const xhr = new XMLHttpRequest();

  // Open GET request
  xhr.open('GET', url);

  xhr.send();

  // Handle successful response
  xhr.onload = () => {
    if (xhr.status === 200) {
      // Get response to parse from JSON to access img property
      const meme = JSON.parse(xhr.responseText);
      // Output will be inserted inside the div
      imgTag.src = meme.img;
      div.appendChild(imgTag);
    }
  };

  // Handle error
  xhr.onerror = function(err) {
    console.error(err);
  };
}

function callAxios() {
  // Open Axios request
  axios
    .get('https://xkcd.now.sh/?comic=latest')
    .then(function(response) {
      // Output will be inserted inside the div
      const funnyMeme = response.data.img; // gets image url directly since it's inside the data object (which comes from the response obj)
      imgTag.src = funnyMeme; // makes value from funnyMeme be the source of the image element prev. created
      div.appendChild(imgTag);
    })
    .catch(function(e) {
      console.error(e);
    });
}

document.querySelector('.button1').addEventListener('click', callXml);
document.querySelector('.button2').addEventListener('click', callAxios);
