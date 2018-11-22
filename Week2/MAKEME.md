# Homework Week 2

```
Topics discussed this week:
• Async vs Sync
• Event Loop (order of execution)
• Promises
```

## Step 1: Read

- Read this article on scopes & closures: [explaining-javascript-scope-and-closures](https://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/)

- If you are still not completely clear on promises, here are some additional resources :ring:

  - [Google's post about Promises](https://developers.google.com/web/fundamentals/getting-started/primers/promises)
  - [A nice article from David Walsh](https://davidwalsh.name/promises)
  - [A real life example](https://github.com/mdn/js-examples/blob/master/promises-test/index.html)
  - [stackoverflow](http://stackoverflow.com/questions/13343340/calling-an-asynchronous-function-within-a-for-loop-in-javascript)
  - YouTube: [promises](https://www.youtube.com/watch?v=WBupia9oidU)

## Step 2: Implement requested PR changes

- Fix Requested Changes (if any) on the Pull Request.

## Step 3: Convert callbacks to promises

**_Deadline Thursday_**

### 3.1 Preparation

The homework for week 2 will build on the work you did in week 1. You will create a new branch based on the `week1` branch.

1. Make sure that you committed all changes in the week 1 version of your homework.
2. Create a new `week2` branch:

   ```
   git checkout -b week2
   ```

### 3.2 Assignment

You will continue to work on the files `index.js` and (possibly) `style.css`.

- Complete your GitHub app code from the previous week, if needed, to meet the requirements from that week's assignment.
- Replace all asynchronous callbacks (e.g. as used with XMLHttpRequest) by ES6 promises.
- Beautify your app's styling.
- If not yet completed in week 1, make your app responsive (use CSS media queries and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)).

### 3.3 Handing in your homework

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

1. Push your `week2` branch to GitHub:

   ```
   git push -u origin week2
   ```

2. Create a pull request for your `week2` branch.

Note:

1. Please remove all redundant, commented-out code and console.log's from your files before pushing your homework as finished. There is no need for your mentors to review this stuff.
2. Please make sure your code is well-formatted and follows the recommended naming conventions.

## Step 4: Read before next lecture

Go through the reading material in the [README.md](../Week3/README.md) to prepare for your next class.
