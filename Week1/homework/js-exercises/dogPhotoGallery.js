'use strict'

// Declaring variables
const xmlButton = document.querySelector("#xml-button");
const axiosButton = document.querySelector("#axios-button");
const ul = document.querySelector("ul");

// Getting photo with XMLHttpRequest
function getPhotoWithXML() {
    const xhr = new XMLHttpRequest;
    const endpoint = "https://dog.ceo/api/breeds/image/random";
    xhr.responseType = 'json';
    xhr.open("GET", endpoint, true);
    xhr.send();
    // Appending 'li' and 'img' tags to DOM when it's ready
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const li = document.createElement("li");
            const img = document.createElement("img");
            img.src = xhr.response.message;
            li.appendChild(img);
            ul.appendChild(li);
        };
    };
    xhr.onerror = () => {
        console.log(xhr.status);
    };
};

// Getting photo with XMLHttpRequest
function getPhotoWithAxios() {
    axios
        .get("https://dog.ceo/api/breeds/image/random")
        // Appending 'li' and 'img' tags to DOM when it's ready
        .then(function(response){
            const li = document.createElement("li");
            const img = document.createElement("img");
            img.src = response.data.message;
            li.appendChild(img);
            ul.appendChild(li);
        })
        .catch(function(error){
            console.log(error);
        });
};

xmlButton.addEventListener("click", getPhotoWithXML);
axiosButton.addEventListener("click", getPhotoWithAxios);