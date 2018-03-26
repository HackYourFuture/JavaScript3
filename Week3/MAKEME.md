# Homework Week 1

```
Topics discussed this week:
• Object Oriented Programming and ES6 Classes
• The this keyword
• call, apply, bind
```

## Step 1: Give feedback

_Deadline Monday_

Give feedback on Step 3 of last weeks homework. Please provide the feedback in an issue.

## Step 2: Issues

_Deadline Monday_

- Solve all your Git issues. DO NO CLOSE AN ISSUE WITHOUT AN EXPLANATION OR CODE COMMIT REFERENCING THAT ISSUE.

## Step 3: Fix issues

_Deadline Thursday_

- Fix the issues from the last weeks and make sure you explain how you fixed the issue in a comment (or commit message)

## Step 4

_Deadline Wednesday_

- Sort the list the repositories in the `<select>` by name (case-insensitive).
- Refactor your app to replace `.then()` and `.catch()` with `async`/`await` and `try...catch`.

Read:

- [try...catch](../../../../fundamentals/blob/master/fundamentals/try_catch.md)
- [async/await](../../../../fundamentals/blob/master/fundamentals/async_await.md)

## Step 5: OOP and ES6 classes

- If you need to refresh your memory on es6 classes: [es6-classes-in-depth](https://ponyfoo.com/articles/es6-classes-in-depth)

_Deadline Saturday_

Refactor your GitHub app to use OOP with ES6 classes (see skeleton code below). We will be introducing a `Repository` and a `Contributor` class that will each be responsible for rendering their own data. A third `View` class will contain all remaining code.

Read:

- [Object Oriented Programming and ES6 Classes](../../../../fundamentals/blob/master/fundamentals/oop_classes.md)
- [The `this` keyword](../../../../fundamentals/blob/master/fundamentals/this.md)

Instructions:

1. You should refactor your code to use three classes, named `Repository`, `Contributor` and `View`.
2. Move your existing code that deals with rendering the repository information to the `render()` method of the `Repository` class.
3. Move your existing code that deals with rendering the information for a single contributor to the `render()` method of the `Contributor` class.
4. Move your existing code responsible for initializing your application to the `constructor` of the `View` class.
5. The bulk of your remaining code should probably go to the `fetchAndRender()` method of the `View` class.

### Skeleton

Use this skeleton as overall design for your code in `app.js`:

```js
'use strict';
{
  const hyfUrl = 'https://api.github.com';
  const hyfReposUrl = hyfUrl + '/orgs/HackYourFuture/repos?per_page=100';
  const repoUrl = hyfUrl + '/repos/HackYourFuture/';

  class Repository {
    constructor(data) {
      this.data = data;
    }

    /**
     * Render the repository info into the DOM.
     * @param {HTML element} parent The parent element in which to render the repository
     * info.
     */
    render(parent) {
      // Add your code here.
      // This method should render the repository data stored in the 'data' property
      // as HTML elements and append them to the `parent` element.
    }
  }

  class Contributor {
    constructor(data) {
      this.data = data;
    }

    /**
     * Render the contributor info into the DOM.
     * @param {HTML element} parent The parent element in which to render the contributor
     * info.
     */
    render(parent) {
      // Add your code here.
      // This method should render the contributor data stored in the 'data' property
      // as HTML elements and append them to the `parent` element.
    }
  }

  class View {
    constructor() {
      // Add code here to initialize your app
      // 1. Create the fixed HTML elements of your page
      // 2. Make an initial XMLHttpRequest to populate your <select> element
    }

    /**
     * Fetch information for the selected repository and render the
     * information as HTML elements in the DOM
     * @param {*} repoName The name of the selected repository
     */
    fetchAndRender(repoName) {
      const leftDiv = ...;
      const rightDiv = ...;

      // ...

      this.fetchJSON(repoUrl + repoName)
        .then(repoInfo => {
          const repo = new Repository(repoInfo);
          return this.fetchJSON(repoInfo.contributors_url)
            .then(contributors => {
              repo.render(leftDiv);
              contributors
                .map(contributor => new Contributor(contributor))
                .forEach(contributor => contributor.render(rightDiv));
            });
        })
        .catch(error => {
          // add error handling code here
        });
    }


    /**
     * Fetch API data as JSON data in a promise
     * @param {string} url The URL of the API endpoint.
     * @returns A promise.
     */
    fetchJSON(url) {
      // Add your code here
    }
  }

  window.onload = new View();
}
```

Note:

1. Please remove all redundant, commented-out code and console.log's from your files before pushing your homework as finished. There is no need for your mentors to review this stuff.
2. Please make sure your code is well-formatted and follows the recommended naming conventions.
## Step 6: Read before next lecture

_Deadline Sunday morning_

Go trough the reading material in the [README.md](https://github.com/HackYourFuture/Node.js) of the Node repository to prepare for your next class.

## _BONUS_ : Code Kata Race

If you haven't already join our clan: "Hack Your Future" in codewars

Solve the following problems:
- [Problem 1](https://www.codewars.com/kata/keep-up-the-hoop)
- [Problem 2](https://www.codewars.com/kata/find-the-first-non-consecutive-number)
- [Problem 3](https://www.codewars.com/kata/negation-of-a-value)
- Some more [Homework](https://www.codewars.com/collections/hyf-homework-1)

_Hints_
- Hint for Q1: split your code into two parts, one part for the case that one of the two strings has an extra letter at the start or the end but is otherwise identical & one part for the case that the strings are the same length but one character is different in one of the strings
- Also for Q1 this function on strings might be useful: [JavaScript String slice() method](https://www.w3schools.com/jsref/jsref_slice_string.asp)
- Also potentially useful: [JavaScript String charAt() Method](https://www.w3schools.com/jsref/jsref_charat.asp)
- [Hint for Q2](https://www.w3schools.com/jsref/jsref_sort.asp) Also there are no sample tests, you need to use submit

Remember the person with the most kata points gets a prize from Gijs (and you can do exercises on this website without us assigning them - anything kyu 7 or kyu 8 you can try to do - kyu 6 or lower is probably too hard) -->

-[MORE BONUS](https://www.codewars.com/collections/hyf-homework-1-bonus-credit) :collision:
