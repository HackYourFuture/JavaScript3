'use strict';

class Util {
  static createEl(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    for (let key in options) {
      if (key === "txt") {
        elem.innerHTML = options.txt;
      } else {
        elem.setAttribute(key, options[key]);
      }
    }
    return elem;
  }

  static fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status <= 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Network request failed: ${xhr.status} - ${xhr.statusText}`));
      xhr.send();
    });
  }
}
