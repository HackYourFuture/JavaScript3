# Homework Week 3

```
Topics discussed this week:
• Object Oriented Programming and ES6 Classes
• The this keyword
• call, apply, bind
```

## Step 1: Fix requested changes

_Deadline Wednesday_

- Fix the requested changes from the PR from the last weeks and make sure you explain how you fixed the issue in a comment.

## Step 2

### 2.1 Preparation

The homework for week 3 will build on the work you did in week 2. You will create a new branch based on the `week2` branch.

1. Make sure that you committed all changes in the week 2 version of your homework.
2. Create a new `week3` branch:

    ```
    git checkout -b week3
    ```

### 2.2 Assignment

This week you will work with all JavaScript files in the `src` folder. The assignment consists of two parts:

1. Refactor all `.then()` and `.catch()` methods with `async`/`await` and `try...catch`.
2. Refactor your application to use ES6 classes.

#### 2.2.1 async/await

**_Deadline Thursday_**

_Read:_

- [try...catch](../../../../fundamentals/blob/master/fundamentals/try_catch.md)
- [async/await](../../../../fundamentals/blob/master/fundamentals/async_await.md)

_Instructions:_

- Refactor all `.then()` and `.catch()` methods with `async`/`await` and `try...catch`.

TODO: ARIA-compliance

#### 2.2.2 Bonus assignment: ES6 Classes

**_Deadline Saturday_**

This final **bonus** assignment requires you to got the extra mile and master Object Oriented Programming and ES6 classes. ES6 classes are not used in the Node and Database modules. You will not come across them again until the React module.

TODO: Is this optional/bonus? Separate branch `final`?

**_Deadline Thursday_**

In this assignment you need to redistribute and adapt the code from `index.js` to the files `App.js`, `Repository.js` and `Contributor.js`. You do not need to modify `Util.js`.

| File             | Description |
|------------------|-------------|
| `App.js`         | The `App` class contains the start-up code and manages the overall orchestration of the app. |
| `Repository.js`  | The `Repository` class holds code and data for a single repository. |
| `Contributor.js` | The `Contributor` class holds code and data for a single contributor. |
| `Util.js`        | The `Util` class contains static helper methods for use in the other classes. |

The `App.js`, `Repository.js` and `Contributor.js` files each contain skeleton code that you can use to migrate portions of your code from `index.js` to.

_Read:_

- HYF fundamental: [ES6 Classes](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/oop_classes.md#es6-classes)
- More on ES6 classes: [ES6 Classes in Depth](https://ponyfoo.com/articles/es6-classes-in-depth)

_Instructions:_

1. Commit any outstanding changes.
2. Change the content of the `body` tag of `index.html` as follows:

    ```html
    <body>
      <div id="root"></div>
      <script src="./Util.js"></script>
      <script src="./Repository.js"></script>
      <script src="./Contributor.js"></script>
      <script src="./App.js"></script>
    </body>
    ```


## Step 3: OOP and ES6 classes

- If you need to refresh your memory on es6 classes: [es6-classes-in-depth](https://ponyfoo.com/articles/es6-classes-in-depth)

_Deadline Saturday_

Refactor your GitHub app to use OOP with ES6 classes (see skeleton code below). We will be introducing a `Repository` and a `Contributor` class that will each be responsible for rendering their own data. A third `View` class will contain all remaining code.

Read:

- [Object Oriented Programming and ES6 Classes](../../../../fundamentals/blob/master/fundamentals/oop_classes.md)
- [The `this` keyword](../../../../fundamentals/blob/master/fundamentals/this.md)

Instructions:

1. You should refactor your code into four classes, named `App`, `Repository`, `Contributor` and `Util`.
2. Move your existing code that deals with rendering the repository information to the `render()` method of the `Repository` class.
3. Move your existing code that deals with rendering the information for a single contributor to the `render()` method of the `Contributor` class.
4. Move your existing code responsible for initializing your application to the `constructor` of the `View` class.
5. The bulk of your remaining code should probably go to the `fetchAndRender()` method of the `View` class.

TODO: describe the division of work between the classes


### 3.3 Handing in your homework

1. Push your `week2` branch to GitHub:

    ```
    git push -u origin week2
    ```

2. Create a pull request for your `week2` branch.

Note:

1. Please remove all redundant, commented-out code and console.log's from your files before pushing your homework as finished. There is no need for your mentors to review this stuff.
2. Please make sure your code is well-formatted and follows the recommended naming conventions.
## Step 6: Read before next lecture

_Deadline Sunday morning_

Go trough the reading material in the [README.md](https://github.com/HackYourFuture/Node.js) of the Node repository to prepare for your next class.

## Alternative _BONUS_ : Code Kata Race

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
