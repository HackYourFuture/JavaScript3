# AJAX Crash Course

Please watch the first 45 mins of the Ajax Crash Course by Traversy Media (see link below).

The example code in this course is using on ES5 syntax. In the **ajaxcrash** folder in this repo you will find updated example code (**ajax1** to **ajax3**) that use the ES6 syntax and styling that we prefer in HYF. Specifically, the following changes have been made:

1. The JavaScript code has been placed in a separate file, loaded with a `<script>` tag from the HTML file.
2. Instead of **var** to declare a variable, **const** and **let** are used.
3. The non-strict equality operator `==` has been replaced with the strict version `===`.
4. Functions are defined before they are used.
5. Anonymous functions use the arrow syntax instead of the **function** keyword. Consequently, the `this` value inside the **XMLHttpRequest** event handlers have been replaced with the `xhr` variable name.
6. The `for...in` loops for iterating through an array have been replace with `for...of`. 

Watch this YouTube video up until the PHP examples (45 mins):

> Traversy Media - [Ajax Crash Course](https://youtu.be/82hnvUYY6QA)