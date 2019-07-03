'use strict';

// eslint-disable-next-line no-unused-vars
class Util {
  static createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  static fetchJSON(url) {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`Network request failed`);
      }
      return response.json();
    });
  }
}
