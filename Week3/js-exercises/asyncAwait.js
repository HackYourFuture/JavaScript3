'use strict';

// In this exercise you'll practice refactoring Promise syntax into async/await + try/catch syntax. Rewrite exercise A & B using async/await + try/catch syntax.

// Exercise A
/*
function getData(url) {
    fetch(url)
      .then(response => response.json)
      .then(json => console.log(json))
      .catch(error => console.log(error));
  }
  getData('https://randomfox.ca/floof/');
*/

const url = 'https://randomfox.ca/floof/';

function addImageToDOM(json) {
  const foxImgEl = document.createElement('img');
  foxImgEl.src = json.image;
  foxImgEl.style.width = '300px';
  document.body.appendChild(foxImgEl);
}

function addErrorToDOM(e) {
  const pErrorEl = document.createElement('p');
  pErrorEl.innerText = `Oops! ${e}`;
  document.body.appendChild(pErrorEl);
}

async function getData() {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    addImageToDOM(json);
  } catch (e) {
    console.error(e);
    addErrorToDOM(e);
  }
}
getData(url);

// Exercise B
const arrayOfWords = ['cucumber', 'tomatos', 'avocado'];
/*
const makeAllCaps = array => {
  return new Promise((resolve, reject) => {
    const capsArray = array.map(word => {
      if (typeof word === 'string') {
        return word.toUpperCase();
      }
      reject('Error: Not all items in the array are strings!');
    });
    resolve(capsArray);
  });
};
makeAllCaps(arrayOfWords)
  .then(result => console.log(result))
  .catch(error => console.log(error));
*/

async function makeAllCaps(array) {
  try {
    const lowerCaseWords = await array;
    const capsArray = await array.map(word => {
      if (typeof word === 'string') {
        return word.toUpperCase();
      }
    })
    console.log(capsArray);
  } catch (error) {
    console.log(`Error: Not all items in the array are strings! - ${error}`);
  }
}
makeAllCaps(arrayOfWords);
