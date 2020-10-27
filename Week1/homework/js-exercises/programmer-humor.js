/* Who knew programmers could be funny?

Write a function that makes a HTTP Request to https://xkcd.now.sh/?comic=latest

Inside the same file write two programs: one with XMLHttpRequest, and the other with axios
Each function should make a HTTP Request to the given endpoint: https://xkcd.now.sh/?comic=latest
Log the received data to the console
Render the img property into an <img> tag in the DOM
Incorporate error handling: log to the console the error message*/

const makeXmlRequest = () => {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://xkcd.now.sh/?comic=latest');
  xhr.onload = () => {
    if (xhr.status === 200) {
      let result = JSON.parse(xhr.responseText);
      console.log(result);
      const createdImg = document.createElement('img');
      createdImg.setAttribute('src', result.img);
      document.querySelector('body').appendChild(createdImg);
    } else {
      console.log('Something went wrong', xhr.statusText, xhr.statusText);
    }
  };
  xhr.send();

  xhr.onerror = () => {
    console.log('Request Faild', xhr.status, xhr.statusText);
  };
};

makeXmlRequest();

const makeAxiosRequest = () => {
  axios
    .get('https://xkcd.now.sh/?comic=latest')
    .then(response => {
      console.log(response);
      let result = response.data;
      const createdImg = document.createElement('img');
      createdImg.setAttribute('src', result.img);
      document.querySelector('body').appendChild(createdImg);
    })
    .catch(err => {
      console.log(err);
    });
};
makeAxiosRequest();
