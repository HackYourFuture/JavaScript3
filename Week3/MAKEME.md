# Homework Week 3

```
Topics discussed this week:
• Object Oriented Programming and ES6 Classes
• The this keyword
• call, apply, bind
```

## Step 1: Fix requested changes

_Deadline Monday_

- Fix Requested Changes (if any) on the Pull Request.

## Step 2

**_Deadline Thursday_**

### 2.1 Preparation

**Read the fundamental pages on:**

- [try...catch](../../../../fundamentals/blob/master/fundamentals/try_catch.md)
- [async/await](../../../../fundamentals/blob/master/fundamentals/async_await.md)

The homework for week 3 will build on the work you did in week 2. You will create a new branch based on the `week2` branch.

1. Make sure that you committed all changes in the week 2 version of your homework.
2. Create a new `week3` branch:

   ```
   git checkout -b week3
   ```

### 2.2 Assignment

This week you will work with all JavaScript files in the `src` folder. The assignment consists of two parts:

1. Refactor all `.then()` and `.catch()` methods with `async`/`await` and `try...catch`.
2. Make your app ARIA-compliant (see below).
3. Refactor your application to use ES6 classes.

#### 2.2.1 async/await

**Instructions:**

1. Refactor all `.then()` and `.catch()` methods with `async`/`await` and `try...catch`.

2. Make sure that your error handling code still works. See the week2 MAKEME on how to force an error response from GitHub.

#### 2.2.2 ES6 Classes

**_Deadline Saturday_**

This final assignment requires you to go the extra mile and master Object Oriented Programming and ES6 classes.

In this assignment you need to redistribute and adapt the code from `index.js` to the files `App.js`, `Repository.js` and `Contributor.js`. You do not need to modify `Util.js`.

| File             | Description                                                                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index2.html`    | You should load this HTML file in your browser instead of `index.html` to work with the classes version of your homework. It loads the following JavaScript files through `<script>` tags in the `<body>` element: |
| `App.js`         | The `App` class contains the start-up code and manages the overall orchestration of the app.                                                                                                                       |
| `Repository.js`  | The `Repository` class holds code and data for a single repository.                                                                                                                                                |
| `Contributor.js` | The `Contributor` class holds code and data for a single contributor.                                                                                                                                              |
| `Util.js`        | The `Util` class contains static helper methods for use in the other classes.                                                                                                                                      |

The `App.js`, `Repository.js` and `Contributor.js` files each contain skeleton code that you can use to migrate portions of your code from `index.js` to.

_Read:_

- HYF fundamental: [ES6 Classes](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/oop_classes.md#es6-classes)
- More on ES6 classes: [ES6 Classes in Depth](https://ponyfoo.com/articles/es6-classes-in-depth)

#### 2.2.3 ARIA-compliance (BONUS)

Please review the material from the HTML/CSS module: [Get familiar with Accessible Rich Internet Applications (ARIA)](https://github.com/HackYourFuture/HTML-CSS/tree/master/Week1#get-familiar-with-accessible-rich-internet-applications-aria).

For the GitHub application ARIA-compliance means that the Contributors list should either be a native HTML list (i.e. using `ul` and `li` elements) or otherwise marked with an appropriate ARIA **role**. Furthermore, a user should be able to navigate through all interactive elements using the keyboard (e.g., using the **Tab** key). Pressing **Enter** on such an element should be equivalent to clicking the mouse.

#### 2.2.4 Handing in your homework

If necessary, review the instructions how to [Hand in homework](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/homework_pr.md) using GitHub pull request.

To test whether your code will be accepted when you submit your homework as a pull request you need to ensure that it does not contain ESLinr errors. Open a terminal window in VSCode and type the following command:

```
npm test
```

If any errors or warnings are reported by this command you need to fix them before submitting a pull request.

In addition, check for the following:

- Have you removed all commented out code (should never be present in a PR)?
- Do the variable, function and argument names you created follow the [Naming Conventions](../../../../fundamentals/blob/master/fundamentals/naming_conventions.md)?
- Is your code well-formatted (see [Code Formatting](../../../../fundamentals/blob/master/fundamentals/code_formatting.md))?

If the answer is 'yes' to the preceding questions you are ready to follow these instructions:

1. Push your `week3` branch to GitHub:

   ```
   git push -u origin week3
   ```

2. Create a pull request for your `week3` branch.

## Step 3: Read before next lecture

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
