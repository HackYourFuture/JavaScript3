# Homework JavaScript3 Week 1

## **Todo list**

1. Practice the concepts
2. JavaScript exercises
3. Code along
4. PROJECT: Hack Your Repo I

## **1. Practice the concepts**

This week's concepts can be challenging, therefore let's get an easy introduction using some interactive exercises! Check the following resources out and start practicing:

- [Learn JavaScript: Requests](https://www.codecademy.com/learn/introduction-to-javascript/modules/intermediate-javascript-requests)

## **2. JavaScript exercises**

> Inside of your `JavaScript3` fork and inside of the `Week1` folder, create a folder called `homework`. Inside of that folder, create a folder called `js-exercises`. For all the following exercises create a new `.js` file in that folder (3 files in total). Make sure the name of each file reflects its content: for example, the filename for exercise one could be placeKitten.js.

**Exercise 1: Who do we have here?**

Wouldn't it cool to make a new friend with just the click of a button?

Write a function that makes an API call to `https://www.randomuser.me/api`

- Inside the same file write two functions: one with `XMLHttpRequest`, and the other with `axios`
- Each function should make an API call to the given endpoint: `https://www.randomuser.me/api`
- Log the received data to the console
- Incorporate error handling

**Exercise 2: Programmer humor**

Who knew programmers could be funny?

Write an function that makes an API call to `https://xkcd.now.sh/?comic=latest`

- Inside the same file write two programs: one with `XMLHttpRequest`, and the other with `axios`
- Each function should make an API call to the given endpoint: `https://xkcd.now.sh/?comic=latest`
- Log the received data to the console
- Render the `img` property into an `<img>` tag in the DOM
- Incorporate error handling

**Exercise 3: Dog photo gallery**

Let's make a randomized dog photo gallery!

Write a function that makes an API call to `https://dog.ceo/api/breeds/image/random`. It should trigger after clicking a button in your webpage. Every time the button is clicked it should append a new dog image to the DOM.

- Create an `index.html` file that will display your random image
- Add 2 `<button>` and 1 `<ul>` element, either in the HTML or through JavaScript
- Write two versions for the button functionality: one with `XMLHttpRequest`, and the other with `axios`
- When any one of the 2 buttons is clicked it should make an API call to `https://dog.ceo/api/breeds/image/random`
- After receiving the data, append to the `<ul>` a `<li>` that contains an `<img>` element with the dog image
- Incorporate error handling

## **3. Code along**

Now that you've learned about APIs and how to connect with them, let's apply it in the context of a complete application.

In the following application you'll be making an API call to an external, public API.

Enjoy!

- [Vanilla JS Numbers Facts App - AJAX & Fetch](https://www.youtube.com/watch?v=tUE2Nic21BA)

## **4. PROJECT: Hack Your Repo I**

In the following three weeks you are going to write a _Single Page Application_ (SPA) that makes use of the [GitHub API](https://developer.github.com/v3/guides/getting-started/).

Figure 1 below shows an example of what your application will look like.

![UI Example](./assets/hyf-github.png)

This application does 2 things:

1. It makes connection to the GitHub API and retrieves all the repositories found in the [HackYourFuture account](https://www.github.com/hackyourfuture).
2. It displays those repositories in an alphabetically-oreded list. When a user clicks on any of the repository names it will show more details about it.

### Getting an overview

For this week you're expected to build upon pre-existing code, found in the folder `homework`. Here's what you'll find:

| Filename     | Description                       |
| ------------ | --------------------------------- |
| `hyf.png`    | Contains the HackYourFuture logo. |
| `index.html` | The application's HTML file.      |
| `index.js`   | A starter JavaScript file.        |
| `style.css`  | A starter CSS file.               |

As you'll experience in your job, you'll be exposed to an already existing codebase. It's an essential skill to get used to doing this. But how?

### A first examination

1. Open `index.html` and examine its contents (but don't modify anything). Notice that the HTML `<body>` looks like this:

   ```html
   <body>
     <div id="root"></div>
     <script src="./index.js"></script>
   </body>
   ```

   The `<body>` tag contains a single `<div>` to which you will need to dynamically append HTML elements through your JavaScript code in `index.js`.

2. Open `index.js`. This file contains a starter set of code for you to expand. It contains the following three functions:

   | Function          | Description                                                                                                  |
   | ----------------- | ------------------------------------------------------------------------------------------------------------ |
   | `fetchJSON`       | Uses `XMLHttpRequest` to fetch JSON data from an API end point. This function uses an asynchronous callback. |
   | `createAndAppend` | A utility function for easily creating and appending HTML elements.                                          |
   | `main`            | Contains the start-up code for the application.                                                              |

   `index.js` also contains a variable with the URL required for fetching information about the HYF repositories:

   ```js
   const HYF_REPOS_URL =
     'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
   ```

3. Open the `index.html` file in your browser. You will see an unordered list with the names of the HYF repositories.

4. Review the `main()` function in `index.js` and examine how this code fetches the JSON data and calls renders the data as unordered list in the web page.

5. Take a look at the API URL:

```
https://api.github.com/orgs/HackYourFuture/repos?per_page=100
```

This URL is special, as it gives us data in JSON format (Try it out in your browser!). This type of URL is also known as an `endpoint`, an address that we can use to send a request to in order to get data. Learn more about endpoints [here](https://smartbear.com/learn/performance-monitoring/api-endpoints/).

Note the query string `?per_page=100` in the above URL. If you don't specify this `query string` you will only get the first 30 repositories (the default `per_page` is 30, which we know because it says so in the [API documentation](https://developer.github.com/v3/#pagination)).

### Week 1 Assignment

The assignment for this week is to produce a functional application that looks similar to Figure 1:

![UI Example](./assets/hyf-github.png)

Functionally, the application should do the following:

1. Make an API call to the endpoint: https://api.github.com/orgs/HackYourFuture/repos?per_page=100
2. Display the first 10 items in the HTML file (write JavaScript to add element to the DOM)
3. Show feedback when an error has happened

Modify the following files:

**1. `index.js`**

- Add new functions and modify function `main()` as you see fit.
- Render network errors to the DOM (see Figure 2 below for an example). Do not use `console.log` as regular users will not see the console output. Instead, create an element that displays the error message in the DOM. Use the predefined `alert-error` class from `style.css` to style your error. It should look like this:

![Error rendering](./assets/hyf-github-error.png)

<small>Figure 2. Rendering of network errors.</small>

**2. `style.css`**

- Add your own CSS styling. Use `style.css` for all of your CSS rules to style the `index.html`. Make sure your UI is responsive. Try it with Chrome Developer Tools in the browser, using a mobile phone format and a tablet format, portrait and landscape.

  **You are not allowed to use a CSS library such as Bootstrap.**

**Hints:**

- To sort the list repositories use [`.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) and [`.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).

- Use CSS media queries, percentage values and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) to make the UI responsive.

- To force a `404` network error so that you can test the rendering of errors, change the URL to make an invalid GitHub request, e.g. append an `x` to `orgs`: `orgsx`.

Good luck!

## **SUBMIT YOUR HOMEWORK!**

After you've finished your todo list it's time to show us what you got! The homework that needs to be submitted is the following:

1. JavaScript exercises
2. PROJECT: HackYourRepo I

Upload both to your forked JavaScript3 repository in GitHub. Make a pull request to your teacher's forked repository.

> Forgotten how to upload your homework? Go through the [guide](../hand-in-homework-guide.md) to learn how to do this again.

_Deadline Saturday 23.59 CET_
