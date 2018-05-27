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


## Step 2: Feedback

- Create at least 2 issues (bug / feature / code improvement) on another student's GitHub repository.
- Solve the issue(s) proposed by another students in your GitHub repository. More info [here](https://hackyourfuture.slack.com/files/michahell/F31BX1XT6/Merging_a_local_branch_into_master).

## Step 3: Promises

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
- Make your app responsive (use CSS media queries and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)).
- Make your app ARIA-compliant.

**ARIA-compliance**

Please review the material from the HTML/CSS module: [Get familiar with Accessible Rich Internet Applications (ARIA)](https://github.com/HackYourFuture/HTML-CSS/tree/master/Week1#get-familiar-with-accessible-rich-internet-applications-aria).

For the GitHub application ARIA-compliance means that the Contributors list should either be a native HTML list (i.e. using `ul` and `li` elements) or otherwise marked with an appropriate ARIA **role**. Furthermore, a user should be able to navigate to all interactive elements using the keyboard (e.g., using the **Tab** key). Pressing **Enter** on such an element should be equivalent to a clicking the mouse.

### 3.3 Handing in your homework

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

