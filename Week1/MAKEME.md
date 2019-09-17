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

**Exercise 1: Place the kitten**

Who doesn't love kittens on their screen?

Write an function that makes an API call to https://wwww.placekitten.com/api

- Inside the same file write two programs: one with `XMLHttpRequest`, and the other with `Axios`
- Log the received data to the console
- Incorporate error handling

**Exercise 2: Who do we have here?**

Wouldn't it cool to make a new friend with just the click of a button?

Write a function that makes an API call to https://www.randomuser.me/api

- Inside the same file write two programs: one with `XMLHttpRequest`, and the other with `Axios`
- Log the received data to the console
- Incorporate error handling

**Exercise 3: Photo gallery**

Let's make a randomized photo gallery!

Write a function that makes an API call to https://picsum.photos/400

- Create an `index.html` file that will display your random image
- Write two programs: one with `XMLHttpRequest`, and the other with `Axios`
- After receiving the data, render it to the page in a `<li>`
- Incorporate error handling

## **3. Code along**

Now that you've learned about APIs and how to connect with them, let's apply it in the context of a complete application.

In the following application you'll be making an API call to an external, public API.

Enjoy!

- [Vanilla JS Numbers Facts App - AJAX & Fetch](https://www.youtube.com/watch?v=tUE2Nic21BA)

## **4. PROJECT: Hack Your Repo I**

> In this assignment you will built upon some existing code that is already pre-written by your teachers. Your homework consist of writing the code to make the application work as requested per week.

In the following three weeks you are going to write a _Single Page Application_ (SPA) that makes use of the [GitHub API](https://developer.github.com/v3/guides/getting-started/).

Figure 1 below shows an example of what your application could look like.

![UI Example](./assets/hyf-github.png)

This application serves 2 purpose:

1. It makes connection to the GitHub API and retrieves all the repositories found in the [HackYourFuture account](https://www.github.com/hackyourfuture).
2. It displays those repositories in an alphabetically-oreded list. When a user clicks on any of the repository names it will show more details about it.

### Getting an overview

For this week you're expected to build upon the pre-existing code, found in the folder `homework`. Here's what you'll find:

| Filename     | Description                       |
| ------------ | --------------------------------- |
| `hyf.png`    | Contains the HackYourFuture logo. |
| `index.html` | The application's HTML file.      |
| `index.js`   | A starter JavaScript file.        |
| `style.css`  | A starter CSS file.               |

As you'll experience in your job, you'll be exposed to an already existing codebase. It's an essential skill to get used to doing this. But how?

### A first examination

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
   const HYF_REPOS_URL =
     'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
   ```

3. Open the `index.html` file in your browser. You will see an unordered list with the names of the HYF repositories.

4. Review the `main()` function in `index.js` and examine how this code fetches the JSON data and calls renders the data as unordered list in the web page.

5. Take a look at the API URL:

```
https://api.github.com/orgs/HackYourFuture/repos?per_page=100
```

> This URL is special, as it gives us data in JSON format. This type of URL is also known as an `endpoint`, an address that we can use to send a request to in order to get data. Learn more about endpoints [here](https://smartbear.com/learn/performance-monitoring/api-endpoints/).

If you open this URL in the browser (_try it!_) you will receive JSON data about the available HYF repositories. This is the data that you will need to work with in this assignment.

<small>Note the query string `?per_page=100` in the above URL. If you don't specify this query string you will only get the first 30 repositories (the default `per_page` is 30, which we know because it says so in the [API documentation](https://developer.github.com/v3/#pagination)).</small>

The returned JSON data contains some basic information about each repository, such as `name`, `full_name`, `description` etc. There are also many properties that contain URLs that can be used to obtain detail information about certain aspects of the repository.

### In Summary: the assignment

Do the following to fulfill this week's requirements:

1. Modify **`imdex.js`**: Modify whatever you need in order to successfully make an API call to the HackYourFuture GitHub account and display the results inside the DOM. It is not likely that you will need to modify `fetchJSON()` and `createAndAppend()`.

2. Add your own CSS styling inside **`style.css`**. Avoid using JavaScript for styling unless there is a genuine need. **You are not allowed to use a CSS library such as Bootstrap.**

**Hints**

- Use CSS media queries and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) to make the UI responsive.

Good luck!

## **SUBMIT YOUR HOMEWORK!**

After you've finished your todo list it's time to show us what you got! The homework that needs to be submitted is the following:

1. JavaScript exercises
2. PROJECT: HackYourRepo I

Upload both to your forked JavaScript3 repository in GitHub. Make a pull request to the original repository.

> Forgotten how to upload your homework? Go through the [guide](../hand-in-homework-guide.md) to learn how to do this again.

_Deadline Saturday 23.59 CET_
