'use strict';
// Let's make a randomized photo gallery!

// Write a function that makes an API call to https://picsum.photos/400

// Create an index.html file that will display your random image
// Write two programs: one with XMLHttpRequest, and the other with axios
// Each function should make an API call to the given endpoint: https://picsum.photos/400
// After receiving the data, render it to the page in a <img>
// Incorporate error handling

const galleryUrl = 'https://picsum.photos/400';
function getRandomizedPhoto(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';

  xhr.addEventListener('load', () => callback(null, xhr));
  xhr.addEventListener('error', () =>
    callback(`Oops, an error occurred! Check your access...`),
  );
  xhr.send();
}

getRandomizedPhoto(galleryUrl, function(error, data) {
  if (error) {
    console.log(error);
  } else {
    if (data.status >= 200 && data.status < 300) {
      const imgURL = window.URL.createObjectURL(data.response);
      const img = document.createElement('img');
      img.setAttribute('src', imgURL);
      document.body.appendChild(img);
    } else {
      console.log(`${data.responseText} : ${data.status}`);
    }
  }
});

(function getRandomizedPhotoWithAxios() {
  axios
    .get(galleryUrl)
    .then(data => {
      const img = document.createElement('img');
      img.setAttribute('src', data.request.responseURL);
      document.body.appendChild(img);
    })
    .catch(error => console.log(error));
})();
