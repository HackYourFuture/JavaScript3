# Reading material for the third lecture:

```
In week three we will discuss the following topics:
• Object Oriented Programming and ES6 Classes
• The this keyword
• call, apply, bind
```

Here are resources that we like you to read as a preparation for the third lecture:

## 1. fetch

Watch this YouTube video to learn about **fetch**. You can find the corresponding code examples in the **traversy_fetch_api** folder. Note that we have moved the inline JavaScript code from `index.html` into a separate `app.js` file. To run this code, open the HTML file by right-clicking its name in the VSCode Explorer and select **Open with Live Server** from the context menu.

- Traversy Media (YouTube, 31 mins): [Fetch API Introduction](https://youtu.be/Oive66jrwBs)

## 2. axios

The **fetch** API is available in all modern browsers, except in Internet Explorer. However, it is not available in Node.js for backend applications. An alternative to **fetch** is the **axios** library. This library supports ES6 promises and uses **XMLHttpRequest** internally when used in a browser, and Node.js primitive functions when used in the backend. These details are hidden to the developer using **axios** who just sees a universal interface (methods and properties), irrespective of whether working in the frontend (browser) or backend (Node.js).

Review the first example from the **axios** repository on GitHub:

- https://github.com/axios/axios

Read:

- [Fetch vs. Axios.js for making HTTP requests](https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5)

## 3.  async/await

Revisit the video from last week for async/await (skip to 20:00 on the timeline):

- Traversy Media (YouTube, 24 mins) - [Async JS Crash Course - Callbacks, Promises, Async Await](https://youtu.be/PoRJizFvM7s?t=1200)

**async/await** is an alternative syntax for 'consuming' ES6 promises, in place of calling **.then()** method. It was introduced in ES7. To handle errors, instead of calling **.catch()**, you need to wrap the code that uses **await** in a **try/catch** block

Read:

- HYF Fundamental - [async & await](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/async_await.md)
- HYF Fundamental - [try...catch](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/try_catch.md)

## 4. OOP

Watch Traversy Media's JavaScript OOP Crash Course (YouTube, 40 mins). A link to the video and more details can be found here:

-  [JavaScript OOP Crash Course (ES5 & ES6)](./traversy_oop_crash).

For another perspective, (optionally) watch the following YouTube playlist (11 videos, 66 mins). You may want to quickly step through the first three videos, as they repeat material that should already quite familiar to you.

- The Net Ninja - [Object Oriented JavaScript](https://www.youtube.com/playlist?list=PL4cUxeGkcC9i5yvDkJgt60vNVWffpblB7)

Read:

- HYF Fundamental - [Object-Oriented Programming & Classes](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/oop_classes.md)


## 5. `this`, `call` `apply`, `bind`

- HYF Fundamental - [What is 'this'?](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/this.md)
- MDN - [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- MDN - [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- MDN - [Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)


## 6. Recommended Readings

[Eloquent JavaScript: Chapter 6 - The Secret Life of Objects](http://eloquentjavascript.net/06_object.html). Read up to the section of **Maps**.

_Please go through the material and come to class prepared!_