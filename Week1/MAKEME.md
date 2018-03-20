# Homework Week 1

```
Topics discussed this week:
• Structure for a basic SPA
• XMLHttpRequests
• API calls
```


>[Here](/Week3/README.md) you find the readings you have to complete before the ninth lecture.

## Step 1: Feedback

_Deadline Monday_

Please provide feedback in an issue.

_Deadline Monday_

## Step 2: FINISH ALL YOUR JAVASCRIPT HOMEWORK

_Deadline Saturday_

:point_up:

## Step 3: SPA :sweat_drops:

_Deadline Saturday_

You are going to write a SPA (Single Page Application) that uses the [GitHub API](https://developer.github.com/guides/getting-started/).

This application should display information about the available [HYF repositories](https://github.com/hackyourfuture):

- You should be able to select a repository from a list of available repositories.
- The application should display high-level information about the selected repository and show a list of its contributors.

Figure 1 below shows an example of what your application could look like. Note that this is just an example. If you find it boring or unimaginative, please improve on it! On the other hand, a simpler version is OK too, so long as you implement the expected functionality.

![UI Example](./assets/hyf-github.png)

Figure 1. Example User Interface using [Material Design](https://material.io/guidelines/) principles.

### Instructions

1. Create this application in the `week1` folder of your `hyf-javascript1` repo. Your application should at minimum consist of the files `index.html`, `style.css` and `app.js`.
2. Your `index.html` file should load the `style.css` and `app.js` files, using the appropriate HTML tags.
3. The `body` of your `index.html` should contain a single `div` element like this: `<div id="root"></div>`.
4. All other HTML elements should be generated programmatically by your `app.js` file and ultimately be hanging off the root `div` element.
5. Implement the repository selection list by means of an HTML [\<select\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) element.

You will need to use XMLHttpRequests against the GitHub API to get the relevant information. The GitHub API documentation is very extensive. An overview is given [here](https://developer.github.com/v3/) but we will point you to the relevant sections in the documentation needed for this assignment.

#### List of repositories

You can obtain a list of HYF repositories through this API endpoint ([What is an API Endpoint?](https://teamtreehouse.com/community/what-is-an-api-endpoint)):

```
https://api.github.com/orgs/HackYourFuture/repos?per_page=100
```

GitHub API documentation: [List organization repositories](https://developer.github.com/v3/repos/#list-organization-repositories)

Note the query string `?per_page=100`. If you don't specify this query string you will only get the first 30 repositories (the default `per_page` is 30 and HYF has more than 30 - but less than 100).

#### Get repository information

You can get information about a specific repository through this API endpoint:

```
https://api.github.com/repos/HackYourFuture/[repositoryName]
```

You should replace `[repositoryName]` with the actual name of the repository.

GitHub API documentation: [Get](https://developer.github.com/v3/repos/#get)

### Get contributor information

The response object that is returned by GitHub from the request to get repository information includes a property with the `contributors_url`. Use the value of this property to make a new request to GitHub to obtain a list of contributors.

Note that, as a result of selecting a repository from the `<select>` element, your code must make two XMLHttpRequests, one after the other:

1. A first request to obtain repository information.
2. A second request using the `contributors_url` obtained from (1) to get a list of contributor information.

Both requests must be done asynchronously.

Making two XMLHttpRequests in a row, where the second requests depends on the response of the first request is part of the assignment. While it is possible to figure out beforehand what the value of the `contributors_url` will be (by carefully reading the documentation), and subsequently make two independent XMLHttpRequests, this is not what is expected.

In the lecture we developed some utility functions to simplify making XMLHttpRequests and creating and manipulating HTML elements. You are free to copy and use these utility functions, but if you do we expect that you can explain how they work.

### Refinements

- Make all the repositories link to their own page in GitHub. Use the value of the key: `name` to make this work (hint: GitHub urls always look like this https://api.github.com/repos/HackYourFuture/[repositoryName] where [repositoryName] would be replaced by the actual `name` of the repository, for example `CommandLine`).
- Make sure the link opens in a new tab.


### Important

- Do not duplicate code! This is especially important for making requests since we are making multiple ones with different urls and we want to do different actions based on the call we are making. Here are some handles to get you started:
  - Write a function called `fetchJSON` (or copy from the lecture code) which accepts (at least) the following parameters: `url` and `callback`.
  - Make sure your `callback` is called when the request errors or when it sends a response (look at the documentation)
  - Your `callback` functions should accept two parameters so it can handle both errors: `err` and `response`.
  So when a user selects a repository from the list you want to call `fetchJSON` with a different `url` and supply it with a function that handles both errors (display an error message to the user for example) and responses (render it correctly as HTML elements in your page).
- When the user changes the selected repository, any existing repository information in your page should be cleared before displaying the new information.
- Make your functions small and reusable (modular)! That means create separate functions to handle certain steps.

Note:

1. Please remove all redundant, commented-out code and console.log's from your files before pushing your homework as finished. There is no need for your mentors to review this stuff.
2. Please make sure your code is well-formatted and follows the recommended naming conventions.

_GO WILD_

Again, check out the GitHub API documentation to see what kind of magic stuff you can do with it.

The assignment is to implement something extra that is not in the assignment :scream: (nice and vague, right?)

Endless fun and possibilities. Need inspiration? Check out the GitHub API documentation. Oh, and please make it look nice (hint: use the stuff you learned in HTML/CSS)!


_BONUS_ : Code Kata Race

- [Codewars](https://www.codewars.com/collections/hyf-homework-number-2)


## Step 5: Read before next lecture

_Deadline Sunday morning_

Go trough the reading material in the [README.md](/Week2/README.md) to prepare for your next class.

>Commit and push your homework in your "hyf-javascript3" GitHub repository.
Make sure that your commit message are meaningful.
Place the link to your repository folder in Trello.