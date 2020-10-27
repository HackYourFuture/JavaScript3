/* Let's make a randomized dog photo gallery!

Write a function that makes a HTTP Request to https://dog.ceo/api/breeds/image/random. It should trigger after clicking a button in your webpage. 
Every time the button is clicked it should append a new dog image to the DOM.

Create an index.html file that will display your random image
Add 2 <button> and 1 <ul> element, either in the HTML or through JavaScript
Write two versions for the button functionality: one with XMLHttpRequest, and the other with axios
When any one of the 2 buttons is clicked it should make a HTTP Request to https://dog.ceo/api/breeds/image/random
After receiving the data, append to the <ul> a <li> that contains an <img> element with the dog image
Incorporate error handling: log to the console the error message*/

const axiosButton = document.getElementById('axios');
const xmlButton = document.getElementById('xml');

const getRandomDogXml = () => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://dog.ceo/api/breeds/image/random');

  xhr.onload = () => {
    if (xhr.status === 200) {
      let result = JSON.parse(xhr.responseText);
      const photosList = document.querySelector('ul');
      const createdListItem = document.createElement('li');
      const createdImage = document.createElement('img');

      createdImage.setAttribute('src', result.message);
      createdImage.setAttribute('class', 'rounded mx-auto d-block mt-4');
      createdImage.style.width = '400px';
      createdImage.style.height = '400px';
      createdImage.style.border = '3px solid red';
      createdListItem.appendChild(createdImage);
      photosList.style.listStyle = 'none';
      photosList.appendChild(createdListItem);
    } else
      throw new Error(`Somthing went wrong ${xhr.status} : ${xhr.statusText}`);
  };

  xhr.onerror = () => {
    console.log(`Request Faild : ${xhr.status} ${xhr.statusText}`);
  };

  xhr.send();
};

const getRandomDogAxios = () => {
  axios
    .get('https://dog.ceo/api/breeds/image/random')
    .then(response => {
      let result = response.data.message;
      const photosList = document.querySelector('ul');
      const createdListItem = document.createElement('li');
      const createdImage = document.createElement('img');

      createdImage.setAttribute('src', result);
      createdImage.setAttribute('class', 'rounded mx-auto d-block mt-4');
      createdImage.style.width = '400px';
      createdImage.style.height = '400px';
      createdImage.style.border = '3px solid blue';
      createdListItem.appendChild(createdImage);
      photosList.style.listStyle = 'none';
      photosList.appendChild(createdListItem);
    })
    .catch(err => {
      console.log(err);
    });
};

xmlButton.addEventListener('click', getRandomDogXml);
axiosButton.addEventListener('click', getRandomDogAxios);
