'use strict';
{
function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status < 400) {
            cb(null, xhr.response)
        } else {
            cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
    }
    xhr.onerror = ()=> {
        cb(new Error('Network request failed'));
    };
    xhr.send();
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
    })
    return elem;
}
window.fetchJSON = fetchJSON;
window.createAndAppend = createAndAppend;
}