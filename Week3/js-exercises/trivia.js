'use strict';

/*
Exercise 3: Trivia time!

Don't you just love trivia games? Let's make our own!
In this exercise you'll make use of the Open Trivia Database API. You are going to fetch 5 random trivia questions and then inject them into the DOM, inside of an accordion.

Here are the requirements:
**Create a folder called trivia-app, that includes an HTML, CSS and JavaScript file
**Link them all together in the HTML file
Only provide the basic structure in the HTML file. All other DOM elements are to be created using JavaScript
**No CSS frameworks are allowed!
Sometimes the strings you get back from the API contains HTML entities (like &quote;). Find out a way to turn this into regular text
*/

const url =
  'https://opentdb.com/api.php?amount=5&category=11';

//create elements
const headerEl = document.createElement('header');
const divHeaderEl = document.createElement('div');
const divHeadingEl = document.createElement('h1');
const spanYellowEl = document.createElement('span');
const spanRedEl = document.createElement('span');
const pHeadingEl = document.createElement('p');
const mainEl = document.createElement('main');
const sectionEl = document.createElement('section');
const divTriviaEl = document.createElement('div');
spanYellowEl.innerText = "Let's play some";
spanRedEl.innerText = 'Trivia!';
pHeadingEl.innerText =
  'Try your best to figure out the answer. If you really have no clue, click on the question to reveal the answer...';
divHeaderEl.classList.add('header-container');
divHeadingEl.classList.add('heading');
spanYellowEl.classList.add('trivia-color-yellow');
spanRedEl.classList.add('trivia-color-red');
pHeadingEl.classList.add('instructions-text');
sectionEl.classList.add('section-container');
divTriviaEl.classList.add('div-trivia-container');

//add elements to the DOM
document.body.appendChild(headerEl);
headerEl.appendChild(divHeaderEl);
divHeaderEl.appendChild(divHeadingEl);
divHeadingEl.appendChild(spanYellowEl);
divHeadingEl.appendChild(spanRedEl);
divHeaderEl.appendChild(pHeadingEl);
document.body.appendChild(mainEl);
mainEl.appendChild(sectionEl);
sectionEl.appendChild(divTriviaEl);

async function addTriviaToDOM(question, answer) {
    try {
        const questionButtonEl = await document.createElement('button');
        questionButtonEl.classList.add('question-button');
        questionButtonEl.id = 'question-btn';
        questionButtonEl.innerHTML = `${question}`;
        divTriviaEl.appendChild(questionButtonEl);
        async function addAnswerToDOM(answer){
        const answerDivEl = await document.createElement('div');
        const answerPEl = await document.createElement('p');
        answerDivEl.classList.add('answer-container');
        answerPEl.innerHTML = `${answer}`;
        questionButtonEl.appendChild(answerDivEl);
        answerDivEl.appendChild(answerPEl);
    }
        questionButtonEl.addEventListener("click", function(){
        questionButtonEl.classList.add('question-button-clicked');
        addAnswerToDOM(answer)
    }, {once : true});
    } catch (error) {
       console.log(error); 
    }
}


async function fetchAndDisplayTrivia(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const triviaArray = await data.results;
    console.log(triviaArray);

    const singleTrivia = await triviaArray.map(result => {
        console.log(result.question);
        const question = result.question;
        const answer =  result.correct_answer;
        addTriviaToDOM(question, answer);
    });
  } catch (error) {
      console.log(`Oops! ${error}`)
      sectionEl.innerHTML = `<div class="error-message">Oops! ${error}</div>`;
  }
}

fetchAndDisplayTrivia(url);
