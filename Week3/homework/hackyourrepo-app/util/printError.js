// to print the error message incase of error
function printError(err) {
  document.body.innerHTML = `
  <main><div class="container" >
  <header>HYF Repositories  
  </header>
  <div id="errorMessage">${err}</div >
  </main >`;
}
