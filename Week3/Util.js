'use strict';

// eslint-disable-next-line no-unused-vars
class Util {
  static dataRequest(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(App.networkError());
      xhr.send();
    });
  }

  static createHTMLElement(tag, parent, text) {
    const newElement = document.createElement(tag);

    (text) ? newElement.innerHTML = text : '';
    if (parent) {
      parent.appendChild(newElement);
    } else {
      document.body.appendChild(newElement);
    }
    return newElement;
  }

  static setAttributes(el, attrib) {
    for (const key in attrib) {
      el.setAttribute(key, attrib[key]);
    }
  }

  static handleError(tag) {
    tag.innerHTML = ('Network Error: 404 Not Found');
    tag.style.backgroundColor = 'red';
    tag.style.padding = '30px';
  }

}
