# Reading Material JavaScript3 Week 2

## Agenda

These are the topics for week 2:

1. JavaScript Versions
2. Promises
   - Callback Hell
3. Arrow functions
   - 'this' keyword
4. Fetch API
5. Thinking Like a Programmer III

## 1. JavaScript Versions

You are undoubtably different than when you were a baby. Back then you couldn't really do much: crying, laughing and taking dumps. That's pretty much it. But as the years pass you increasingly could do more and more: walking, socializing or playing an instrument.

Likewise, so has JavaScript evolved. Throughout the course you have, unknowingly, used syntax from different JavaScript versions. For example, if you've ever declared a function like this:

```js
function aFunction() {
  // Some magnificent code ...
}
```

You did so using an old version of JavaScript.

But if you've ever used `arrow` functions (which you'll learn more about in the next section), you did so using a newer version of JavaScript.

That's good and all, but why is this important to differentiate? There are several reasons:

- Each feature (and its updates) of a language is made to solve a specific problem. It's important to know the context and purpose of each in order to know how to use it
- Software is always evolving. This means that there are different versions that different users might be using. This means not every feature will work for every application.

That's why it's important to know a little about the history of JavaScript: it will make you think of JavaScript (and hopefully software in general) as a continually evolving thing, as opposed to "just a bunch of concepts and techniques you need to memorize".

Check the following resources out to learn more about this:

- [The History of JavaScript | Why is JavaScript also called ECMAScript?](https://www.youtube.com/watch?v=JpwxjkpZfhY)
- [The Weird History of JavaScript](https://www.youtube.com/watch?v=Sh6lK57Cuk4)

## 2. Promises

### Callback Hell

By now you should've had some practice using callbacks. To reiterate, we use callbacks **as a way to create asynchronicity** in our application: we want to enable our application to do multiple things simultaneously.

But what if you want to have callbacks within callbacks... within callbacks? This will lead to what is known as **callback hell**.

- [Callback Hell](http://callbackhell.com/)

This is where `Promises` come in. The concept of a Promise, in execution, doesn't add anything new. It does exactly what callbacks aim to do, which is enabling asynchronous actions: for example, clicking a button to load in an image, while still being able to navigate the webpage.

What a Promise does is make writing callbacks more readable for you, the developer. This is its main benefit. In effect, you could call Promises the updated version of callbacks. Callbacks version 2.0.

Go through the following resources to learn more about Promises:

- [Let's learn ES6 - Promises](https://www.youtube.com/watch?v=vQ3MoXnKfuQ)
- [A Simple Guide to ES6 Promises](https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a)
- [Promises](https://www.github.com/hackyourfuture/fundamentals/blob/master/fundamentals/promises.md)

## 3. Arrow functions

One of a programmer's favorite things to do is to write clean and concise code. Arrow functions are a new way to write functions, given to us by the ECMAScript 6 (The software standard JavaScript is based upon) update of JavaScript.

It is written like this:

```js
// Arrow function
() => {};
```

Go through the following resources to learn more about why they're important:

- [JavaScript ES6 Arrow Functions](https://www.youtube.com/watch?v=h33Srr5J9nY)
- [Let's learn ES6 - Arrow functions](https://www.youtube.com/watch?v=oTRujqZYhrU)
- [When (and why) you should use ES6 arrow functions — and when you shouldn’t](https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/)

### The `this` keyword

In JavaScript, like in any other programming language you'll find, there are certain special keywords that always create a specific effect. The `this` keyword is one of those.

In everyday communication we use words like "this" or "that" whenever we want to refer to things in the world or something someone said. It's similarly used in JavaScript.

Simply put: `this` refers to any object it's defined in. The global object, `window` is the default value of `this`. However, anything a new object is created will have its own `this` value.

Go through the following resources to learn more about `this`:

- [Understanding "this" in JavaScript](https://www.codementor.io/dariogarciamoya/understanding--this--in-javascript-du1084lyn)
- [JavaScript "this" keyword](https://www.youtube.com/watch?v=gvicrj31JOM)

## 4. Fetch API

Last week you learned about making API calls. You learned how to do this using the XHR object, which we can access through the browser's `window` object.

Now as we've learned in the previous sections, JavaScript as a language evolves continually. But so do browsers! New features get added to increase the user experience and make life easier for developers.

One of those features added to browsers is an upgraded version of the XHR object. It's called `fetch` and it's the modern way to make API calls. It incorporates Promises, making it easier to handle your server responses.

A `fetch` function is now provided in the global `window` scope in the browser. You can check it out by opening your developers tools and searching for `fetch`. Keep in mind that this only counts for certain browser version. To figure out which browsers can use fetch, check [this](https://caniuse.com/#feat=fetch) out.

Learn more about `fetch`:

- [Fetch API Introduction](https://www.youtube.com/watch?v=Oive66jrwBs)
- [Fetch() - Working with Data and APIs in JavaScript](https://www.youtube.com/watch?v=tc8DU14qX6I)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
