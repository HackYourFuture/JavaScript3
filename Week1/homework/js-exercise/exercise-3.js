const xhr = new XMLHttpRequest();

const fetchURL = 'https://dog.ceo/api/breeds/image/random';
const rootDiv = document.getElementById('root');

function createAndAppend(element, append, text) {
  const newElement = document.createElement(element);
  append.appendChild(newElement);
  newElement.innerHTML = text;
}

function fetchXhr() {
  xhr.open('GET', fetchURL);
  xhr.responseType = 'json';
  // eslint-disable-next-line consistent-return
  xhr.onload = () => {
    let dogList = '';
    dogList += `<li><img width=100px src="${xhr.response.message}"/></li>`;
    createAndAppend('ul', rootDiv, dogList);
  };
  xhr.send();
}

function fetchAxios() {
  axios
    .get(fetchURL)
    .then(response => {
      let dogList = '';
      dogList += `<li><img width=100px src="${response.data.message}"/></li>`;
      createAndAppend('ul', rootDiv, dogList);
    })
    .catch(error => {
      console.log(error);
    });
}

document.getElementById('button1').addEventListener('click', fetchXhr);
document.getElementById('button2').addEventListener('click', fetchAxios);
