// Take a look at the following function (and try it out in your console):

// const getAnonName = (firstName, callback) => {
//   setTimeout(() => {
//     if (!firstName)
//       return callback(new Error("You didn't pass in a first name!"));

//     const fullName = `${firstName} Doe`;

//     return callback(fullName);
//   }, 2000);
// };

// getAnonName('John', console.log);
// Rewrite this function, but replace the callback syntax with the Promise syntax:

// Have the getAnonName function return a new Promise that uses the firstName parameter
// If the Promise resolves, pass the full name as an argument to resolve with
// If the Promise rejects, pass an error as the argument to reject with: "You didn't pass in a first name!"

function getAnonName(firstName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (firstName) {
        const fullName = `${firstName} Doe`;
        return resolve(fullName)
      } else {
        reject(console.log("You didn't pass in a first name!"))
      }
    }, 2000)
  })
}
getAnonName("John")
  .then(res => console.log(res))
  .catch((error) => {
    console.log(error);
  })

