// create the promise - reject

function getMyAge() {
  return new Promise((resolve, reject) => {
    reject('I will not give you my age');
  });
}

function getMyName() {
  return new Promise((resolve, reject) => {
    resolve('Nadine');
  });
}
// create resolve
// function getMyAge() {
//   return new Promise((resolve, reject) => {
//     resolve();
//   });
// }

// using the promise for resolve

getMyAge()
  .then(age => {
    console.log(age);
    return getMyName();
  })
  .then(name => console.log(name))
  // using the promise for reject
  .catch(err => console.log(err));
