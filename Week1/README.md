# Reading material for the first lecture:

```
In week one we will discuss the following topics:
• Structure for a basic SPA (Single Page Application)
• AJAX & XMLHttpRequests
• API calls
```

Here are resources that we like you to read as a preparation for the first lecture:

## 1. DOM manipulation

To refresh your DOM manipulation skills, watch this YouTube video series from Traversy Media:

- [JavaScript DOM Crash Course](https://youtu.be/0ik6X4DJKCc).

You will be using these particular DOM manipulation methods and properties in the JS3 homework for the next three weeks:

#### Course Video Part 1 (39 mins):

- `document.getElementById()`
- `element.textContent`

#### Course Video Part 2 (21 mins):

- `document.createElement()`
- `element.setAttribute()`
- `element.appendChild()` 

#### Course Video Part 3 (34 mins):

- `change` event (`<select>` element)
- `element.addEventListener()`

Note that throughout the video lectures the presenter uses `var` to declare variables. We prefer that you use `const` and `let` instead in your homework.

## 2. APIs

In the homework we will be using the GitHub API. Learn about remote Web APIs in general from this YouTube video (18 min) from Traversy Media:

- [What Is A RESTful API? Explanation of REST & HTTP](https://youtu.be/Q-BpqyOT3a8).

For more research, check out the following resources:

- [What are APIs - series](https://www.youtube.com/watch?v=cpRcK4GS068&list=PLcgRuP1JhcBP8Kh0MC53GH_pxqfOhTVLa)

## 3. AJAX & XMLHttpRequests

Please watch the first 45 mins of the Ajax Crash Course (up until the PHP examples) by Traversy Media:

- [Ajax Crash Course](https://youtu.be/82hnvUYY6QA)

The example code in this course is using on ES5 syntax. In the **traversy_ajax_crash** folder in this repo you will find updated example code (**ajax1**...**ajax3**) that use the ES6 syntax and styling that we prefer in HYF. Specifically, the following changes have been made:

1. The JavaScript code has been placed in a separate file, loaded with a `<script>` tag from the HTML file.
2. Instead of **var** to declare a variable, **const** and **let** are used.
3. The non-strict equality operator `==` has been replaced with the strict version `===`.
4. Functions are defined before they are used.
5. Anonymous functions use the arrow syntax instead of the **function** keyword. Consequently, the `this` value inside the **XMLHttpRequest** event handlers have been replaced with the `xhr` variable name.
6. The `for...in` loops for iterating through an array have been replace with `for...of`. 

Read more about using **XMLHttpRequest**:

- [Making HTTP Requests in JavaScript](https://www.kirupa.com/html5/making_http_requests_js.htm)

### Clean Code

- [How to write clean code? Lessons learnt from “The Clean Code” — Robert C. Martin](https://medium.com/mindorks/how-to-write-clean-code-lessons-learnt-from-the-clean-code-robert-c-martin-9ffc7aef870c). Note that this article includes some code examples written in Java, but the same principles can equally be applied to JavaScript.

- [Clean Code concepts adapted for JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

### Handing in homework using GitHub pull requests

- HYF Fundamental - [Handing in homework](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/homework_pr.md)
