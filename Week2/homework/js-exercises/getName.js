'use strict';

/*
Exercise 1: John who?

Take a look at the following function (and try it out in your console):

const getAnonName = (firstName, callback) => {
  setTimeout(() => {
    if (!firstName)
      return callback(new Error("You didn't pass in a first name!"));

    const fullName = `${firstName} Doe`;

    return callback(fullName);
  }, 2000);
};

getAnonName('John', console.log);
Rewrite this function, but replace the callback syntax with the Promise syntax:

Have the getAnonName function return a new Promise that uses the firstName parameter
If the Promise resolves, pass the full name as an argument to resolve with
If the Promise rejects, pass an error as the argument to reject with: "You didn't pass in a first name!"
*/

const getAnonName = firstName => {
  // create a new Promise
  const newPromise = new Promise((resolve, reject) => {
    if (firstName) {
      const fullName = `${firstName} Doe`;
      resolve(`${fullName}`);
    }
    if (!firstName) {
      reject(new Error("You didn't pass in a first name!"));
    }
  });

  setTimeout(() => {
    //call my promise and the .then() for resolved promises and catch() for rejected promises
    newPromise
      .then(message => {
        console.log(message);
      })
      .catch(message => {
        console.log(message);
      });
  }, 2000);
};

getAnonName('John');
