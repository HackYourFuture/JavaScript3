/* eslint-disable no-console */

'use strict';

{
  function loadText() {
    // Create XHR Object
    const xhr = new XMLHttpRequest();
    // OPEN - type, url/file, async
    xhr.open('GET', 'sample.txt', true);

    console.log('READYSTATE: ', xhr.readyState);

    // OPTIONAL - used for loaders
    xhr.onprogress = () => {
      console.log('READYSTATE: ', xhr.readyState);
    };

    xhr.onload = () => {
      console.log('READYSTATE: ', xhr.readyState);
      if (xhr.status === 200) {
        // console.log(this.responseText);
        document.getElementById('text').innerHTML = xhr.responseText;
      } else if (this.status === 404) {
        document.getElementById('text').innerHTML = 'Not Found';
      }
    };

    xhr.onerror = () => {
      console.log('Request Error...');
    };

    // xhr.onreadystatechange = () => {
    //   console.log('READYSTATE: ', xhr.readyState);
    //   if xhr.readyState === 4 && xhr.status === 200){
    //     //console.log(this.responseText);
    //   }
    // }

    // Sends request
    xhr.send();
  }

  // readyState Values
  // 0: request not initialized
  // 1: server connection established
  // 2: request received
  // 3: processing request
  // 4: request finished and response is ready

  // HTTP Statuses
  // 200: "OK"
  // 403: "Forbidden"
  // 404: "Not Found"

  document.getElementById('button').addEventListener('click', loadText);
}
