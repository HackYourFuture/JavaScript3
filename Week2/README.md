# Reading Material JavaScript3 Week 2

## Agenda

These are the topics for week 2:

1. JavaScript Versions
2. Promises
   - Callback Hell
   - Promise States
   - Chaining
   - Benefits
3. Arrow functions
   - 'this' keyword
4. Fetch API

## 0. Video Lectures

Your teacher Stasel has made video lectures for this week's material. You can find them here: [Videos 6 - 8](https://www.youtube.com/playlist?list=PLVYDhqbgYpYVchJ9QQ3rC2WxYKrOiceYX)

<a href="https://www.youtube.com/playlist?list=PLVYDhqbgYpYVchJ9QQ3rC2WxYKrOiceYX" target="_blank"><img src="../assets/stasel.png" width="600" height="350" alt="HYF Video" /></a>

## 1. JavaScript Versions

You are undoubtedly different than when you were a baby. Back then you couldn't do much except crying. That's pretty much it. But as the years pass you increasingly could do more and more: walking, socializing or playing an instrument.

Likewise, so has JavaScript evolved. Throughout the HackYourFuture course you have, unknowingly, used syntax from different JavaScript versions. For example, if you've ever declared a function like this:

```js
function aFunction() {
  // Some magnificent code ...
}
```

You did so using an old version of JavaScript.

But if you've ever used `Arrow Functions` (which you'll learn more about in the next section), you did so using a newer version of JavaScript.

Each feature (and its updates) of a language is made to solve a specific problem. It's important to know the context and purpose of each to know how to use it.

Always be mindful of which **version** of any technology, library or language you are using. This is important, because this means that not everything will work the same way, even if it's the same tool you've been using! In your coding journey you'll come across many code bases that will include different versions of technologies.

Software is always evolving. This means that there are different versions that different users might be using. This means not every feature will work for every application.

Because of this evolutionary nature of software, it's important to know a little about the history of the language you're using. In our case this is JavaScript, and by knowing about its history this will help you think of it as a continually evolving thing, as opposed to "just a bunch of concepts and techniques you need to memorize".

Check the following resources out to learn more about this:

- [The History of JavaScript | Why is JavaScript also called ECMAScript?](https://www.youtube.com/watch?v=JpwxjkpZfhY)
- [The Weird History of JavaScript](https://www.youtube.com/watch?v=Sh6lK57Cuk4)
- [What Is ES6, ES2015, ES2016, ES2017 & ESNext](https://www.youtube.com/watch?v=9A_jkh2AKR8)
- [The Future of JavaScript - New Features and Disruptive Trends in 2020](https://www.youtube.com/watch?v=f0DrPLKf6Ro)

## 2. Promises

### Callback Hell

By now you should've had some practice using callbacks. To reiterate, we use callbacks **as a way to create asynchronicity** in our application: we want to enable our application to do multiple things simultaneously.

But what if you want to have callbacks within callbacks... within callbacks? This will lead to what is known as **callback hell**.

- [Callback Hell](http://callbackhell.com/)

This is where `Promises` come in. The idea of the `Promise` is a product of the evolution within the JavaScript language. A bunch of JavaScript developers wanted to figure out how to solve the problem of callback hell and this is what they came up with. Here's a basic example:

```js
const promise = new Promise(function(resolve, reject) {
  if (true) {
    resolve('It has succeeded!');
  } else {
    reject('It has failed...');
  }
});
```

### Promise States

A promise can be in 1 of 3 states:

1. Pending: The asynchronous code is being executed, with no result yet
2. Fulfilled (resolved): The asynchronous code has successfully been executed without problems
3. Rejected: The asynchronous code has failed because of some error

When a Promises is executed it will first execute the asynchronous code inside. In this process it will go into the `pending` state. After, depending on if it succeeded or not, it will be `resolved` or `rejected`.

### Chaining

What if you need to perform several asynchronous operations, that depend on the result of the one that came before it? For that we can use the `.then()` method: a special function, given to us by the Promise object, that allows us to directly use the return value of the asynchronous operation that happened before. Here's an example:

```js
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000); // We wait 1 second and then resolve with value 1
})
  .then(function(result) {
    console.log(result); // Result: 1
    return result * 2;
  })
  .then(function(result) {
    alert(result); // Result: 2
    return result * 2;
  })
  .catch(error => {
    console.log(error);
  });
```

By chaining the Promise we can gain greater control over the results of our asynchronous operations!

### Benefits

The concept of a Promise, in execution, doesn't add anything new. It does exactly what callbacks aim to do, which is enabling `asynchronous actions`: for example, clicking a button to load in an image, while still being able to navigate the webpage.

So what are the benefits of using a Promise over a callback? Here's a few:

1. It makes writing asynchronous JavaScript code more readable for you, the developer. In effect, you could call Promises the updated version of callbacks. Callbacks version 2.0.
2. Better error handling, because of the `catch` block attached at the end. When something goes wrong within the Promise structure, it will throw an error. This error will then be caught and handled within the `catch` block.

Go through the following resources to learn more about Promises:

- [JavaScript Promises for Dummies](https://scotch.io/tutorials/javascript-promises-for-dummies)
- [Let's learn ES6 - Promises](https://www.youtube.com/watch?v=vQ3MoXnKfuQ)
- [JavaScript Promise in 100 Seconds](https://www.youtube.com/watch?v=RvYYCGs45L4)
- [A Simple Guide to ES6 Promises](https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a)

## 3. Arrow Functions

One of a programmer's favorite things to do is to write clean and concise code. `Arrow Functions` are a new way to write functions, given to us by the ECMAScript 6 (The software standard JavaScript is based upon) update of JavaScript.

It's a little different from regular functions, take a look:

```js
// ES5 Function
function addNum(num1, num2) {
  return num1 + num2;
}

// Arrow Function (stored in variable)
const addNum = (num1, num2) => {
  return num1 + num2;
};
```

If you've done some research, you may come to the following conclusions:

1. First of all, the Arrow Function is anonymous by design. If we want to refer to it, we should store it into a variable.
2. Secondly, the way Arrow Functions can be written can differ (while still working the same way). Sometimes you don't need the `()` if there's a single or no parameters. Sometimes you can `return` a value without use for the `return` keyword.

Another big important feature of Arrow Functions (and difference with ES5 functions) is the way they relate to the `this` keyword: instead of creating a new `this` object, it actually inherits it from the parent scope!

If this sounds incomprehensible still, not to worry. In the next section will dive deep into the `this` keyword: what it means and how we can make use of it.

For now, go through the following resources to learn more about why arrow functions are important:

- [JavaScript ES6 Arrow Functions](https://www.youtube.com/watch?v=h33Srr5J9nY)
- [Let's learn ES6 - Arrow Functions](https://www.youtube.com/watch?v=oTRujqZYhrU)
- [When (and why) you should use ES6 arrow functions — and when you shouldn’t](https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/)

### The `this` keyword

In everyday communication, we use words like "this" or "that" whenever we want to refer to things in the world or something someone said. It's similarly used in JavaScript, only instead of real-world things we refer to objects.

In JavaScript `this` refers to any object it's defined in. The global object, `window` is the default value of `this`. So if you go to your console right now and type `this`, you'll get back a reference to the `window` object. The same thing would happen if you to log `this` inside of your JavaScript file:

```js
console.log('what is', this);
```

However, this isn't the only value `this` can have. The moment we create a new object, we create a new `this` keyword that refers to only that object.

```js
const wouter = {
  firstName: 'Wouter',
  lastName: 'Kleijn',
  getFullName: function() {
    return this.firstName + ' ' + this.lastName;
  },
};
```

In this example `this` refers to the complete `wouter` object. If we execute `wouter.getFullName()`, we get back the value of `wouter.firstName` and `wouter.lastName`.

```js
wouter.getFullName; // Result: Wouter Kleijn
```

As you can imagine, this means that there can be multiple `this` keywords at play: the global `this` keyword (which refers to the `window` object) and a `this` keyword for every object that is created within the application.

Go through the following resources to learn more about `this`:

- [What is THIS in JavaScript? in 100 seconds](https://www.youtube.com/watch?v=YOlr79NaAtQ)
- [JavaScript "this" keyword](https://www.youtube.com/watch?v=gvicrj31JOM)
- [Understanding "this" in JavaScript](https://www.codementor.io/dariogarciamoya/understanding--this--in-javascript-du1084lyn)

## 4. Fetch API

Last week you learned about making HTTP Requests. You learned how to do this using the `XHR` object, which we can access through the browser's `window` object.

Now as we've learned in the previous sections, JavaScript as a language evolves continually. But so do browsers! New features get added to increase the user experience and make life easier for developers.

One of those features added to browsers is an upgraded version of the XHR object. It's called the `Fetch API` and it's the modern way to making HTTP Requests. It incorporates Promises, making it easier to handle your server responses. Here's a basic example:

```js
fetch('https://pokeapi.co/api/v2/pokemon')
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log('Pokemon data', data);
    return data;
  })
  .catch(error => {
    console.log('err', error);
  });
```

Where is this function defined, you may wonder? Simple: it's found in the global `window` object in the browser. You can check it out by opening your console in the browser. Type in `fetch` and you'll get back a function definition.

When your JavaScript file is loaded into the DOM, it automatically will have access to any of the browser's web APIs (one if which is the `Fetch API`). That's why you can use it in your JavaScript files.

> Keep in mind that `fetch` only works on newer browser versions. To figure out which browsers can use fetch, check [this](https://caniuse.com/#feat=fetch) out.

To learn more and practice with the `Fetch API`, check out the following:

- [Fetch API Introduction](https://www.youtube.com/watch?v=Oive66jrwBs)
- [Sending JavaScript Http Requests with the fetch() API](https://www.youtube.com/watch?v=23hrM4saaMk)
- [Fetch() - Working with Data and APIs in JavaScript](https://www.youtube.com/watch?v=tc8DU14qX6I)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
