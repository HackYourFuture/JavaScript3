window.onload = () => {
  document.body.innerHTML = `<div class="container">
  <h1 class="flexItem">Let's play some Trivia!</h1>
    <p class="flexItem">Try your best to figure out the answer. If you really have to no clue, click on question to reveal the answer.....</p>
    <div id="quote" class="flexItem"></div>    
    </div> `;
  getQuote();
};

let getData = async function(url) {
  let response = await fetch(url);
  let json = await response.json();
  return json.results;
};

let getQuote = async function() {
  let dor = await getData(' https://opentdb.com/api.php?amount=5');
  const quote = document.getElementById('quote');
  let output = '';
  for (i in dor) {
    output += `<p class="question">${dor[i].question}</p>
    <p class="answer">${dor[i].correct_answer}</p>`;
  }
  quote.innerHTML = output;
  // console.log(dor);
  let lol = document.querySelector('.question');
  lol.addEventListener('click', function() {
    this.style.backgroundColor = 'red';
  });
  for (j of lol) {
    console.log(j);
  }
};
