'use strict';

const container = document.querySelector('.container');
const xmlButton = document.getElementById('xml');
const axiosButton = document.getElementById('axios');

const getRandomUserXML = function(method, url) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'text';
  xhr.open('GET', 'https://www.randomuser.me/api');

  xhr.onload = () => {
    if (xhr.status == 200) {
      let result = JSON.parse(xhr.responseText).results;
      console.log(result[0]);
      container.innerHTML += `     <div class="card text-white bg-danger mb-3  ml-5 " style="max-width: 18rem;">
                                    <div class="card-header ">A random Friend => <span class='text-danger'>XML</span></div>
                                    <div class="card-body">
                                      <h5 class="card-title" >${result[0].name.title}: ${result[0].name.first} ${result[0].name.last}</h5>
                                      <p class="card-text">Email: ${result[0].email}</p>
                                      <p class="card-text">phone: ${result[0].phone}</p>
                                    </div>
                                  </div>     `;
    } else {
      console.log(
        `There is Something went wrong : ${xhr.status} ${xhr.responseText}`,
      );
    }
  };

  xhr.onerror = () => {
    console.log(`Request Faild : ${xhr.status} : ${xhr.statusText} `);
  };
  xhr.send();
};

const getRandomUserAxios = function(url) {
  axios
    .get('https://www.randomuser.me/api')
    .then(response => {
      console.log(response.data.results);

      let result = response.data.results;
      container.innerHTML += `     <div class="card text-white bg-primary mb-3  ml-5 " style="max-width: 18rem;">
      <div class="card-header ">A random Friend => <span class='text-danger'>Axios</span></div>
      <div class="card-body">
        <h5 class="card-title" >${result[0].name.title}: ${result[0].name.first} ${result[0].name.last}</h5>
        <p class="card-text">Email: ${result[0].email}</p>
        <p class="card-text">phone: ${result[0].phone}</p>
      </div>
    </div>     `;
    })
    .catch(err => {
      console.log(`Oooops !! Something went wrong => ${err}`);
    });
};

axiosButton.addEventListener('click', getRandomUserAxios);
xmlButton.addEventListener('click', getRandomUserXML);

//getRandomUserAxios('https://www.randomuser.me/api');

//getRandomUserXML('GET', 'https://www.randomuser.me/api');
