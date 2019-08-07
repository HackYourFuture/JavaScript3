# Homework JavaScript3 Week 3

## **Todo list**

1. Practice the concepts
2. JavaScript exercises
3. Code along
4. PROJECT: Hack Your Repo III

## **1. Practice the concepts**

## **2. JavaScript exercises**

## **3. Code along**

## **4. PROJECT: Hack Your Repo III**

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
2. Refactor your application to use ES6 classes.

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
