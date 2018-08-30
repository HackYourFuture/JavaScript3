'use strict';
{
function fetchJSON(url) {
    return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status < 400) {
            resolve(xhr.response);
        } else {
            reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
    };
    xhr.onerror = ()=> {
        reject(new Error('Network request failed'));
    };
    xhr.send();
    });
}
function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
        if (key === "text") {
            elem.innerHTML = options[key];
        } else {
            elem.setAttribute(key, options[key]);
        }
    });
    return elem;
}
window.fetchJSON = fetchJSON;
window.createAndAppend = createAndAppend;
}
