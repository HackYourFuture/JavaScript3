
function main() {


  const buttonElement = document.createElement("button");
  document.body.appendChild(buttonElement);
  buttonElement.id = "button";
  buttonElement.innerHTML = "GetPokemon!";

  const formElement = document.createElement("form");
  document.body.appendChild(formElement);

  const selectElement = document.createElement("select");
  formElement.appendChild(selectElement);
  selectElement.id = "select";

  const divElement = document.createElement("div");
  document.body.appendChild(divElement);
  divElement.id = "div";


  const select = document.getElementById("select");
  const url = "https://pokeapi.co/api/v2/pokemon/?limit=151"
  const button = document.getElementById("button");
  const div = document.getElementById("div")
  img = document.createElement("img")


  button.addEventListener('click',
    function fetchData() {
      fetch(url)
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw `ERROR: ${res.status} ${res.statusText}`
          }
        })
        .then((jsonData) => {
          pokemonArr = jsonData.results
          pokemonArr.map((element) => {
            let option = document.createElement("option")
            select.appendChild(option)
            option.value = element.name
            option.innerHTML = element.name
          })
        })
        .catch((error) => {
          console.log(error);
        })
    })

  select.onchange = function addPokemonToDOM() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${select.value}`)
      .then(res1 => {
        if (res1.ok) {
          return res1.json()
        } else {
          throw `ERROR: ${res1.status} ${res1.statusText}`
        }
      })
      .then(function (imageData) {
        div.appendChild(img)
        img.src = imageData.sprites.front_default
      })
      .catch((error) => {
        console.log(error);
      })
  }
} main()


