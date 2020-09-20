'use strict';

// call the function main when the window loaded..
window.addEventListener('load', main);

// The main function
function main() {
  const hackYourRepos =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  // the basic DOM
  document.body.innerHTML = `
  <main>
  <div id="store"></div>
  <div class="container" >
  <header>HYF Repositories
  <select name="selectRepo" id="selectRepo"></select>
  </header>  
  <section id="info">
  <h4 class="labels">Repository:</h4>
  <p id="repo" class="labels"><small class="placeH">Repository Name</small></p>
  <h4 class="labels">Description:</h4>
  <p id="desc" class="labels"><small class="placeH">Description</small></p>
  <h4 class="labels">Forks:</h4>
  <p id="fork" class="labels"><small class="placeH">Forks</small></p>
  <h4 class="labels">Updated:</h4>
  <p id="upDate" class="labels"><small class="placeH">2020-10-10 20:20:20</small></p>
  </section>
  <section id="contributor">
  <div class="contributors">
  <h2>Contributors</h2 >
  </div >
  <div id="contributors_page" ></div>  
  <div id="paginationId" class="pagination"></div>
  </section>
  </div >
  </main >`;

  // call the function to fetch data
  getData(hackYourRepos).catch(err => printError('Network request failed'));
}
