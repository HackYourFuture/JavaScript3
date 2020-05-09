"use strict";

const srcApi = "https://xkcd.now.sh/?comic=latest";
const img = document.createElement("img");

function xmlhttpReq(srcApi) {
  const oreq = new XMLHttpRequest();
  oreq.responseType = "json";
  oreq.onload = function () {
    if (oreq.status === 200) {
      console.log(oreq.response.img);
      img.src = oreq.response.img;
      document.body.appendChild(img);
    } else if (oreq.status === 400) {
      console.log("Something went wrong with Network");
    }
  };
  oreq.onerror = function () {
    alert("Something went wrong with Connection");
  };

  oreq.open("GET", srcApi);
  oreq.send();
}
function reqAxios(srcApi) {
  axios.get(srcApi).then(function (response) {
      console.log(response.data.img);
      img.src = response.data.img;
      document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error(error);
    })
  



xmlhttpReq(srcApi);
reqAxios(srcApi);


}