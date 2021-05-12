function main() {
  function fetchData() { 
    const fetchPromise = fetch("https://ghibliapi.herokuapp.com/people");
    fetchPromise.then(response => {
      console.log(response);
    });
  }
  function addPokemonToDOM(){}
}