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

- [The History of JavaScript | Why is JavaScript also called ECMAScript?](https://www.youtube.com/watch?v=JpwxjkpZfhY)
- [The Weird History of JavaScript](https://www.youtube.com/watch?v=Sh6lK57Cuk4)

## 2. Promises

### Callback Hell

By now you should've had some practice using callbacks. To reiterate, we use callbacks **as a way to create asynchronicity** in our application: we want to enable our application to do multiple things simultaneously.

But what if you want to have callbacks within callbacks... within callbacks? This will lead to what is known as **callback hell**.

- [Callback Hell](http://callbackhell.com/)

This is where Promises come in. The concept of a Promise, in execution, doesn't add anything new. It does exactly what callbacks aim to do, which is enabling asynchronous actions: for example, clicking a button to load in an image, while still being able to navigate the webpage.

What a Promise does is make writing callbacks more readable for you, the developer. This is its main benefit. In effect, you could call Promises the updated version of callbacks. Callbacks version 2.0.

Go through the following resources to learn more about Promises:

- [Let's learn ES6 - Promises](https://www.youtube.com/watch?v=vQ3MoXnKfuQ)
- [A Simple Guide to ES6 Promises](https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a)
- [Promises](https://www.github.com/hackyourfuture/fundamentals/blob/master/fundamentals/promises.md)

## 3. Arrow functions

One of a programmer's favorite things to do is to write clean and concise code. Arrow functions are a new way within

- [Let's learn ES6 - Arrow functions](https://www.youtube.com/watch?v=oTRujqZYhrU)

## 4. Fetch API

Last week you learned about making API calls. You learned how to do this using the XHR object, which we can access through the browser's `window` object.

As we've learned in the previous sections, JavaScript as a language evolves. But so do browsers!

It's a modern way to make API calls. It incorporates Promises. A `fetch` function is now provided in the global `window` scope in the browser. You can check it out by opening your developers tools and searching for `fetch`.

- [Fetch() - Working with Data and APIs in JavaScript](https://www.youtube.com/watch?v=tc8DU14qX6I)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
