const Http = new XMLHttpRequest();

const url = 'https://xkcd.now.sh/?comic=latest';
Http.open('GET', url);
Http.send();

const axios = require('axios').default;

axios
  .get('https://xkcd.now.sh/?comic=latest')
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    // Handle Error Here
    console.error(err);
  });
const image = document.createElement('img');
var x = document.getElementById('img');

Http.onreadystatechange = (e) => {
  console.log(Http.responseText);
};
