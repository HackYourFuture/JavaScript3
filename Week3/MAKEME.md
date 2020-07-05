# Homework JavaScript3 Week 3

## **Todo list**

1. Practice the concepts
2. JavaScript exercises
3. Code along
4. PROJECT: Hack Your Repo III

## **1. Practice the concepts**

Let's continue exercising those programming muscles! Go through the following exercises:

- [Learn JavaScript: Objects](https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-objects)
- [Learn JavaScript: Classes](https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-classes)
- [Learn JavaScript: Async/Await](https://www.codecademy.com/learn/introduction-to-javascript/modules/asynch-js)

## **2. JavaScript exercises**

> Inside of your `JavaScript3` fork and inside of the `Week3` folder, create a folder called `homework`. Inside of that folder, create a folder called `js-exercises`. For all the following exercises create a new `.js` file in that folder (3 files in total). Make sure the name of each file reflects its content: for example, the filename for exercise one could be `getName.js`.

**Exercise 1: **

<!-- This exercise will be about practicing rewriting Promise syntax to async await -->

In this exercise you'll practice refactoring `Promise` syntax into `async/await` + `try/catch` syntax.

```js
// Exercise A


// Exercise B
function getData(url) {
  fetch(url)
    .then(response => response.json)
    .then(json => console.log(json))
    .catch(error => console.log(error));
}

getData('https://randomfox.ca/floof/');
```

**Exercise 2: **

<!-- This exercise will be about practicing creating and using classes -->

**Exercise 3: **

<!-- This exercise will be about practicing -->

## **3. Code along**

In this weeks `code along` you'll be building a website that uses the YouTube API to fetch channel data and videos. You'll be creating a search form to change channels and use [OAuth2](https://www.youtube.com/watch?v=CPbvxxslDTU) to login and logout.

Happy learning!

- [YouTube API Project with Authentication](https://www.youtube.com/watch?v=r-yxNNO1EI8)

## **4. PROJECT: Hack Your Repo III**

> This week we'll continue building on our work from last week. Make sure to navigate to the `hackyourrepo-app` folder and start based on the code you wrote!

Our application is looking pretty nice so far! This week we'll do 2 things:

1. We'll refactor and modularize our application
2. We'll add a feature: pagination!

Let's break each of them apart.

### 4.1 Refactor and modularize application

We'll first start off with refactoring, so that we have a clean codebase to build upon.

Like you've learned this week, refactoring is all about writing "clean code": code that is readible and easy to add to.

When writing the JavaScript code last week, most likely you wrote everything in a single JavaScript file (the `script.js` one). This week we'll create many more files, that we then will all bring together in that `script.js` file to execute. This act is called `modularization`, and you'll practice with this more and more as time goes on.

Next to that you'll refactor your code using the software design principles you've learned about this week: DRY, KISS and others you might have picked up. How does would look like exactly in your codebase is left up to you.

Here are the requirements:

- Create a separate `.js` for every function you create
- Import all top-level functions into the `script.js` file to execute

### 4.2 Add a feature: Pagination

You might have noticed that when a user selects a repository that has many contributors, the page's height becomes bigger and bigger (thus forcing the user to scroll down). Let's change that, by adding pagination!

What is pagination? Take a look at this:

![Pagination Example](https://lorisleiva.com/assets/img/pagination_1.1785fc69.png)

As you can see there are many pages

Here are the requirements:

- Each "page" should contain at max 5 contributors. If the repository selected contains more than 5 contributors, it will get split up unto a different page

Good luck!

## **SUBMIT YOUR HOMEWORK!**

After you've finished your todo list it's time to show us what you got! The homework that needs to be submitted is the following:

Upload your homework to your forked JavaScript3 repository in GitHub. Make a pull request to the teacher's forked repository.

> Forgotten how to upload your homework? Go through the [guide](../hand-in-homework-guide.md) to learn how to do this again.

_Deadline Saturday 23.59 CET_
