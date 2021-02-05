'use strict';

/*
Exercise 2: Is it bigger than 10?

Write a function called checkDoubleDigits that:

Takes 1 argument: a number
Returns a new Promise
If the number is bigger than 10, resolve with the string: "The number is bigger than 10!"
If the number is smaller than 10, reject with the error: "Error! The number is smaller than 10..."
*/

const checkDoubleDigits = number => {
  // create a new Promise
  const newPromise = new Promise((resolve, reject) => {
    if (number > 10) {
      resolve('The number is bigger than 10!');
    }
    if (number < 10) {
      reject('Error! The number is smaller than 10...');
    }
  });

  // call my promise and the .then() for resolved promises and catch() for rejected promises
  newPromise
    .then(message => {
      console.log(message);
    })
    .catch(message => {
      console.log(message);
    });
};

checkDoubleDigits(20);
checkDoubleDigits(5);
