'use strict';

function timerStopped() {
  console.log('timer stopped');
}

function startTimer(duration, callback) {
  console.log('timer started');
  setTimeout(callback, duration);
}

startTimer(2000, timerStopped);
