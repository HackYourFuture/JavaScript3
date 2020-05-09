"use strict";

const userApi = "https://www.randomuser.me/api";

function xmlhttpReq(url) {
  const oreq = new XMLHttpRequest();
  oreq.responseType = "json";
  oreq.onload = function () {
    if (this.status >= 200 &&  this.status < 400) 
    {
      showNew(jsonTree(oreq.response));
      console.log(oreq.response);
    } else {
      console.log(oreq.status, oreq.responseText);
    }
  };
  oreq.onerror = function () {
   console.log("Something went wrong!");
  };

  oreq.open("GET", url);
  oreq.send();
}
// function reqAxios(url) {
//   axios
//     .get(url)
//     .then(function (response) {
//       addnewFace(jsonTree(response.data));
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.error(error);
//     })
//     .finally(function () {
//       console.log("All done");
//     });
// }

const button = document.getElementById("add");

function jsonTree(response) {
  let album = {
    title: response.results[0].name.title,
    name: response.results[0].name.first,
    lastName: response.results[0].name.last,
    country:response.results[0].location.country,
    email: response.results[0].email,
    image: response.results[0].picture.large,
  };
  return album;
}

function showNew(newFace) {
  const main = document.createElement("div");
  main.className = "main";

  const block = document.createElement("div");
  block.className = "block";


  let email = document.createElement("span");
  email.innerText = ` ${newFace.email}`;
  block.appendChild(email);

  let name = document.createElement("span");
  name.innerText = ` ${newFace.title}  ${newFace.name}   ${newFace.lastName}`;
  block.appendChild(name);


  let country=document.createElement("span");
  country.innerText=`From ${newFace.country}`;
  block.appendChild(country);


 



  let img = document.createElement("img");
  img.src = `${newFace.image}`;
  img.height = "150";
  

  main.appendChild(img);
  main.appendChild(block);
  document.body.appendChild(main);
}


button.addEventListener("click", function (){
  xmlhttpReq(userApi);
});