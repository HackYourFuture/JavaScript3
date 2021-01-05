function main() {
  const select = document.getElementById("select");
  const url = "https://pokeapi.co/api/v2/pokemon/?limit=151"
  const button = document.getElementById("button");

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
      const div = document.getElementById("div")
      div.appendChild(img)
      img.src = imageData.sprites.front_default
      img.style.width = "250px"
    })

}




