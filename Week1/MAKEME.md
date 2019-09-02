# Homework Week 1

```
Topics discussed this week:
• Structure for a basic SPA
• XMLHttpRequests
• API calls
```

## Step 1: Single Page Application :sweat_drops:

**_Deadline Thursday_**

_This homework is more extensive and challenging than previous homework! Please read the instructions below carefully and follow them with great attention to detail. Start this homework as soon as you can and allow time for discussion and questions (slack!)._

### 1.1 Introduction

> In this assignment you will built upon some existing code that is already pre-written by your teachers. Your homework consist of writing the code to make the application work as requested per week.

You are going to write a _Single Page Application_ (SPA) that uses the [GitHub API](https://developer.github.com/guides/getting-started/).

This application should display information about the available [HYF GitHub repositories](https://github.com/hackyourfuture). The functionalities we would like to see in your application in the first week are as follows:

- The application should fetch repository information for the HYF GitHub account and display summary information for each repository.
- This list of repositories should be sorted alphabetically by repository name.

Figure 1 below shows an example of what your application could look like.

![UI Example](./assets/hyf-github.png)

<small>Figure 1. Example User Interface using [Material Design](https://material.io/guidelines/) principles.</small>

### 1.2 The GitHub API

#### 1.2.1 Get a list of HYF repositories

You can fetch a list of HYF repositories through this API endpoint ([What is an API Endpoint?](https://teamtreehouse.com/community/what-is-an-api-endpoint)):

```
https://api.github.com/orgs/HackYourFuture/repos?per_page=100
```

If you open this URL in the browser (_try it!_) you will receive JSON data about the available HYF repositories. This is the data that you will need to work with in this assignment.

<small>Note the query string `?per_page=100` in the above URL. If you don't specify this query string you will only get the first 30 repositories (the default `per_page` is 30). HackYourFuture has more than 30 repositories but less than 100.</small>

The returned JSON data contains some basic information about each repository, such as `name`, `full_name`, `description` etc. There are also many properties that contain URLs that can be used to obtain detail information about certain aspects of the repository.

#### 1.2.2 GitHub API documentation

You can find detailed information about the GitHub API by means of the link listed below. However, the documentation is very extensive and not easy to digest. For this homework it is not necessary to study the GitHub API documentation. We provide the link here for completeness.

> GitHub API documentation: https://developer.github.com/v3/

### 1.3 Coding Style

In this homework we will be introducing a preferred coding style and supporting tools to help you write _"clean code"_. A number of popular [_JavaScript Style Guides_](https://codeburst.io/5-javascript-style-guides-including-airbnb-github-google-88cbc6b2b7aa) have recently emerged of which the one developed by [Airbnb](https://github.com/airbnb/javascript) has been chosen for this homework and is recommended for subsequent use during the HYF curriculum. It is documented here:

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

While you do not need to read this guide in detail, it is recommended that you review sections 1-8, 12-13, 15-21 and 23. The tools installed during the project preparation step below will help you to implement these guidelines in your code. You will see error and warning messages in the VSCode editor when your code deviates from the recommended style. An additional check will be done when you submit your homework as a pull request on GitHub.

### 1.5 Preparation

You will be working on the same application during the next three weeks. For each week you will need to create a new Git branch, as listed in the Table 1 below.

| Week | Branch  | Assignment |
| :--: | ------- | ---------- |
|  1   | `week1` | - Create a basic application using callbacks to handle network requests. |                                       
|  2   | `week2` | Based on the `week1` branch:<br>- Display details on a single repository and its contributors<br>- Refactor the callbacks to promises. |
|  3   | `week3` | Based on the `week2` branch:<br>- Refactor the application to use `fetch` and `async`/`await`.<br>- Reuse portions of the code to complete a provided Object Oriented (OOP) version of the application that uses ES6 classes. |

<small>Table 1. Homework schedule</small>

**Instructions**

1. Fork the JavaScript3 repository (_this repository_) to your own GitHub account.
2. Clone the fork to your laptop.
3. Open the newly created `JavaScript3` folder from the cloned repository in VSCode.
4. Open a Terminal window in VSCode and type the following command to install Prettier and ESLint tools as required for the homework:

   ```
   npm install
   ```

5. Create a new branch for the week 1 homework with the following command:

   ```
   git checkout -b week1
   ```

### 1.5 Code Overview

The files that make up the application are located in the `homework` folder. It contains the following files:

| Filename     | Description                       |
| ------------ | --------------------------------- |
| `hyf.png`    | Contains the HackYourFuture logo. |
| `index.html` | The application's HTML file.      |
| `index.js`   | A starter JavaScript file.        |
| `style.css`  | A starter CSS file.               |

Although you should only modify files in the `homework` folder, we recommend that you always open the `JavaScript3` folder rather than directly opening the `homework` folder in VSCode. The `JavaScript3` folder contains the actual git repository and the configuration files required by the installed tools.

_**Do not change or delete any files outside of the `homework` folder!**_

#### 1.5.1 A first examination

1. Open `index.html` and examine its contents (but don't modify anything). Notice that the HTML `body` looks like this:

   ```html
   <body>
     <div id="root"></div>
     <script src="./index.js"></script>
   </body>
   ```

   The `body` tag contains a single `div` to which you will need to dynamically append HTML elements through your JavaScript code in `index.js`.

2. Open `index.js`. This file contains a starter set of code for you to expand. It contains the following three functions:

   | Function          | Description                                                                                                  |
   | ----------------- | ------------------------------------------------------------------------------------------------------------ |
   | `fetchJSON`       | Uses `XMLHttpRequest` to fetch JSON data from an API end point. This function uses an asynchronous callback. |
   | `createAndAppend` | A utility function for easily creating and appending HTML elements.                                          |
   | `main`            | Contains the start-up code for the application.                                                              |

   `index.js` also contains a constant with the URL required for fetching information about the HYF repositories:

   ```js
   const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
   ```

3. Open the `index.html` file in your browser. You will see an unordered list with the names of the HYF repositories.

4. Review the `main()` function in `index.js` and examine how this code fetches the JSON data and calls renders the data as unordered list in the web page.

### 1.6 Week 1 Assignment

1. The assignment is to produce an application similar to the one illustrated in Figure 1 above.

2. You should render network errors to the DOM (see Figure 2 below for an example). Do not use `console.log` as regular users will not see the console output. Use the predefined `alert-error` class from `style.css` to style your error.

3. Your UI should be responsive. Try it with Chrome Developer Tools in the browser, using a mobile phone format and a tablet format, portrait and landscape. If necessary, you can also do this work in week 2.

![Error rendering](./assets/hyf-github-error.png)

<small>Figure 2. Rendering of network errors.</small>

**Code modifications:**

**`index.js`**

- Add new functions and modify function `main()` as you see fit. It is not likely that you will need to modify `fetchJSON()` and `createAndAppend()`.

**`style.css`**

- Add your own CSS styling. Use `style.css` for all your styling your HTML. Avoid using JavaScript for styling unless there is a genuine need. 

    **You are not allowed to use a CSS library such as Bootstrap.**

**Hints:**

* To sort the list repositories use [`.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) and [`.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).

* Use CSS media queries and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) to make the UI responsive.

* To force a `404` network error so that you can test the rendering of errors, change the URL to make an invalid GitHub request, e.g. append an `x` to `orgs`: `orgsx`.


### 1.7 Handing in your homework

If necessary, review the instructions how to [Hand in homework](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/homework_pr.md) using GitHub pull request.

To test whether your code will be accepted when you submit your homework as a pull request you need to ensure that it does not contain ESLint errors. Open a terminal window in VSCode and type the following command:

```
npm test
```

If any errors or warnings are reported by this command you need to fix them before submitting a pull request.

In addition, check for the following:

- Have you removed all commented out code (should never be present in a PR)?
- Do the variable, function and argument names you created follow the [Naming Conventions](../../../../fundamentals/blob/master/fundamentals/naming_conventions.md)?
- Is your code well-formatted (see [Code Formatting](../../../../fundamentals/blob/master/fundamentals/code_formatting.md))?

If the answer is 'yes' to the preceding questions you are ready to follow these instructions:

1. Push your `week1` branch to GitHub:

   ```
   git push -u origin week1
   ```

2. Create a pull request for your `week1` branch.

---

_BONUS_ : Code Kata Race

- [Codewars](https://www.codewars.com/collections/hyf-homework-number-2)

## Step 2: Read before next lecture

_Deadline Sunday morning_

Go through the reading material in the [README.md](/Week2/README.md) to prepare for your next class.
