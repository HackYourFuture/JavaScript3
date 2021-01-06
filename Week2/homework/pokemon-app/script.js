
function main() {

  function addPokemonToDOM() {
    const buttonElement = document.createElement("button");
    document.body.appendChild(buttonElement);
    buttonElement.id = "button";
    buttonElement.innerHTML = "GetPokemon!";

    const formElement = document.createElement("form");
    document.body.appendChild(formElement);

    const selectElement = document.createElement("select");
    formElement.appendChild(selectElement);
    selectElement.id = "select";
    selectElement.setAttribute("onchange", "fetchImage()");

    const divElement = document.createElement("div");
    document.body.appendChild(divElement);
    divElement.id = "div";
  }
  addPokemonToDOM()

  const select = document.getElementById("select");
  const url = "https://pokeapi.co/api/v2/pokemon/?limit=151"
  const button = document.getElementById("button");
  const div = document.getElementById("div")
  img = document.createElement("img")
  button.addEventListener('click',

    function fetchName() {
      fetch(url)
        .then((res) => res.json())
        .then((jsonData) => {
          pokemonArr = jsonData.results
          pokemonArr.map((element) => {
            let option = document.createElement("option")
            select.appendChild(option)
            option.value = element.name
            option.innerHTML = element.name

          })
        });
    })
} main()

function fetchImage() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${select.value}`)

    .then(res1 => res1.json())
    .then(function (imageData) {
      div.appendChild(img)
      img.src = imageData.sprites.front_default
    })
}

// HELLO I DID GET THE GOOD OUTCOME,
// BUT I DONT THINK I MEET ALL THE REQUIREMENTS OF THE EXERSISE
// <select id="button" onchange="fetchImage"()"></select>
// DOESN'T WORK INSIDE OF THE MAIN() FUNCTION
// IN CASE THAT HAS TO BE FIX, I HAVE NO IDEA HOW... :))))
// PLAESE GIVE ME A HIT!!!   


