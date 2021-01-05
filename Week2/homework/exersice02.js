// Exercise 2: Is it bigger than 10?

// Write a function called checkDoubleDigits that:

// Takes 1 argument: a number
// Returns a new Promise
// If the number is bigger than 10, resolve with the string: "The number is bigger than 10!"
// If the number is smaller than 10, reject with the error: "Error! The number is smaller than 10..."



function checkDoubleDigits(number) {
  return new Promise((resolve, reject) => {
    if (number > 10) {
      resolve(console.log("The number is bigger than 10!"))
    } else if (number < 10) {
      reject(console.log("Error! The number is smaller than 10..."))
    }
  })
    .catch((error) => {
      console.log(error);
    })
}
checkDoubleDigits(11)
