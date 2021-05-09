const Http = new XMLHttpRequest();

const url = 'https://www.randomuser.me/api';
Http.open('GET', url);
Http.send();

const axios = require('axios').default;

axios
  .get('https://www.randomuser.me/api')
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    // Handle Error Here
    console.error(err);
  });

Http.onreadystatechange = (e) => {
  console.log(Http.responseText);
};
