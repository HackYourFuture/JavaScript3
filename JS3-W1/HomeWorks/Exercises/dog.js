"use strict";

const dogsApi = "https://dog.ceo/api/breeds/image/random";

function xmlhttpReq(dogsApi) {
  const oreq = new XMLHttpRequest();
  oreq.responseType = "json";
  oreq.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      addPhoto(oreq.response.message);
      console.log(oreq.response);
    } else {
      console.log(oreq.status, oreq.responseText);
    }
  };
  oreq.onerror = function () {
    console.log("Something went wrong!");
  };

  oreq.open("GET", dogsApi);
  oreq.send();
}
function reqAxios(dogsApi) {
  axios.get(dogsApi).then(function (response) {
      addPhoto(response.data.message);
      console.log(response);
    }) 
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      console.log("Fulfilled");
    });
}

const btnXHR = document.getElementById("XHR");
const btnAX = document.getElementById("Axios");

function addPhoto(imgUrl) {
  const dogPhotos = document.getElementById("list");
  let img = document.createElement("img");
  img.src = imgUrl;
  img.height = "250";
  

  let items = document.createElement("li");
  items.appendChild(img);
  dogPhotos.appendChild(items);

  document.getElementById("main").appendChild(dogPhotos);
}

btnXHR.addEventListener("click", function () {
  xmlhttpReq(dogsApi);
});
btnAX.addEventListener("click", function () {
  reqAxios(dogsApi);
});