'use strict'

// Getting image with XMLHttpRequest
function getImgWithXML() {
    const xhr = new XMLHttpRequest;
    const endpoint = "https://xkcd.now.sh/?comic=latest";
    xhr.responseType = 'json';
    xhr.open("GET", endpoint);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.response);
            const img = document.createElement("img");
            img.src = xhr.response.img;
        }else {
            console.log(xhr.status);
        };
    };
};

// Getting image with axios
function getImgWithAxios() {
    axios
        .get("https://xkcd.now.sh/?comic=latest")
        .then(function(response){
            console.log(response);
            const img = document.createElement("img");
            img.src = response.data.img;
        })
        .catch(function(error){
            console.log(error);
        });
};