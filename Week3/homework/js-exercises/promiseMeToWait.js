// Exercise A
async function getData(url) {
  let response = await fetch(url);
  let json = await response.json();
  try {
    json = json.image;
  } catch (err) {
    console.log('hello ' + error);
  }
  return json;
}

getData('https://randomfox.ca/floof/')
  .then(json => console.log(json))
  .catch(err => console.log(err));

// Exercise B
const arrayOfWords = ['cucumber', 'tomatos', 'avocado'];

const makeAllCaps = array => {
  return new Promise((resolve, reject) => {
    let capsArray = array.map(word => {
      if (typeof word === 'string') {
        return word.toUpperCase();
      } else {
        reject('Error: Not all items in the array are strings!');
      }
    });
    resolve(capsArray);
  });
};

async function toPrint() {
  let response = await makeAllCaps(arrayOfWords);
  try {
    console.log(response);
  } catch (error) {
    console.log('there is an error' + error);
  }
}

toPrint();
