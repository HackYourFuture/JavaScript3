'use strict';
{
  function synTimeout(delay) {
    const stopTime = Date.now() + delay;
    while (Date.now() < stopTime);
  }

  function addSyncOnClickListener() {
    document
      .getElementById('btn-sync')
      .addEventListener('click', function onSyncClick() {
        console.log('start sync timer');
        synTimeout(5000);
        console.log('stop sync timer');
      });
  }

  function addAsyncOnClickListener() {
    document
      .getElementById('btn-async')
      .addEventListener('click', function onAsyncClick() {
        console.log('start async timer');
        setTimeout(function onTimeout() {
          console.log('stop async timer');
        }, 5000);
      });
  }

  function addHelloOnClickListener() {
    document
      .getElementById('btn-hello')
      .addEventListener('click', function onHelloClick() {
        console.log('Hello, world!');
      });
  }

  window.onload = () => {
    addSyncOnClickListener();
    addAsyncOnClickListener();
    addHelloOnClickListener();
  };
}