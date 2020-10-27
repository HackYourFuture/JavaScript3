'use strict'

// Getting random user with XMLHttpRequest
function getRandomUserWithXML() {
    const xhr = new XMLHttpRequest;
    const endpoint = "https://www.randomuser.me/api";
    xhr.responseType = 'json';
    xhr.open("GET", endpoint);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.response);
        }else {
            console.log(xhr.status);
        };
    };
};

// Getting random user with axios
function getRandomUserWithAxios() {
    axios
        .get("https://www.randomuser.me/api")
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        });
};