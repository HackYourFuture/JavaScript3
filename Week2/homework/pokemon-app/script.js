'use strict';

/*
    In this exercise you're going to do several things:

    Create and append DOM elements using JavaScript only
    Fetch data twice from a public API PokeAPI
    Display the results in the DOM.
    Here are the requirements:

    Create 3 functions: fetchData, addPokemonToDOM and main
    The main function executes the other functions and contains all the variables
    In the fetchData function, make use of fetch and its Promise syntax in order to get the data from the public API
    Execute the main function when the window has finished loading
*/

function main() {
  // 1. create fetch function
  function fetchData(url) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => console.log(error));
  }

  // 2. Create DOM elements
  const buttonEl = document.createElement('button');
  buttonEl.innerText = 'Get Pokemon!';
  const selectEl = document.createElement('select');
  const imageDivEl = document.createElement('div');
  imageDivEl.style.display = 'flex';
  imageDivEl.style.justifyContent = 'center';
  imageDivEl.style.marginTop = '5%';
  const imageEl = document.createElement('img');
  const outputContainer = document.getElementById('output');
  outputContainer.style.display = 'flex';
  outputContainer.style.justifyContent = 'center';
  outputContainer.style.marginTop = '10%';

  // 3. append DOM elements to the document body
  outputContainer.appendChild(buttonEl);
  outputContainer.appendChild(selectEl);
  document.body.appendChild(imageDivEl);
  imageDivEl.appendChild(imageEl);

  // 4. add event listener
  buttonEl.addEventListener('click', () => {
    fetchData('https://pokeapi.co/api/v2/pokemon?limit=100').then(data => {
      console.log(data);
      addPokemonToDOM(data); // put this data into the DOM
    });
  });

  // 5. feed the select tag with the pokemon options
  function addPokemonToDOM(data) {
    // grab array of objects
    const pokemonArray = data.results;

    for (let index = 0; index < pokemonArray.length; index++) {
      const pokemonName = pokemonArray[index].name;
      const optionEl = document.createElement('option');
      optionEl.innerHTML = `
            <option value="${index}">${pokemonName}</option>
        `;
      selectEl.appendChild(optionEl);
    }
  }

  // select a pokemon and display a matching pokemon
  selectEl.addEventListener('change', event => {
    console.log(event.target.value); // the selected option value

    fetchData('https://pokeapi.co/api/v2/pokemon?limit=100').then(data => {
      data.results.forEach(result => {
        if (event.target.value === result.name) {
          const pokemonURL = result.url;
          fetchData(pokemonURL).then(data => {
            const imageData = data.sprites.other.dream_world.front_default;
            imageEl.src = imageData;
          });
        }
      });
    });
  });
}

main();
