// to create the page when window loaded
window.onload = () => {
  document.body.innerHTML = `<div class="container">
  <h1 class="flexItem">Let's play some Trivia!</h1>
    <p class="flexItem">Try your best to figure out the answer. If you really have to no clue, click on question to reveal the answer.....</p>
    <div id="quote" class="flexItem"></div>    
    </div> `;
  getQuote().catch(err => console.log(err));
};

// to fetch the data
let getData = async function(url) {
  let response = await fetch(url);
  let json = await response.json();
  return json.results;
};

//  to fetch the quotes
let getQuote = async function() {
  let quotes = await getData(' https://opentdb.com/api.php?amount=5');
  const divOfQuote = document.getElementById('quote');
  let output = '';
  for (quote of quotes) {
    output += `<div class="count"><p class="flag">0</p><p class="question">${quote.question}</p>
    <p class="answer">${quote.correct_answer}</p></div>`;
  }
  // append the quotes to the page
  divOfQuote.innerHTML = output;

  let count = document.querySelectorAll('.count');

  for (elem of count) {
    elem.addEventListener('click', function() {
      let first = this.firstElementChild;
      let last = this.lastElementChild;
      if (first.innerHTML == 0) {
        this.classList.add('active');
        first.innerHTML = 1;
        last.style.display = 'block';
      } else {
        this.classList.remove('active');
        first.innerHTML = 0;
        last.style.display = 'none';
      }
    });
  }
};
