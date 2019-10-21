# Reading Material JavaScript3 Week 3

## Agenda

These are the topics for week 3:

1. Object-Oriented Programming (OOP)
   - A different way of thinking
   - 4 pillars of OOP
2. ES6 Classes
   - Data structures revisited
   - Objects
   - Factory functions
   - Constructor functions
   - Classes
3. Async/Await
   - Error handling

## 1. Object-Oriented Programming (OOP)

So far we've learned about various programming concepts. These are the basics of what makes up any application: it's the **WHAT** of programming. However, now that you're familiar with them it's time to go to the next level: the **HOW** of programming.

Like in any field, you first have to master the basics before you can create your own style of creating something new. Let's say that you want to start playing a musical instrument: the piano. At first you have to learn the basics: the different scales, notes, melodies, tempo (music basics), then you have to learn how to compose songs (the piano applied to songs). Once you understand all of that is it time to learn a specific **style** of playing piano.

It's the same way with programming.

Up until now you implicitly learned a basic way of writing code, called `procedural programming`. In this style we break problems up into functions and variables, and execute them as one long procedure. There is no real thought behind code organisation or reusability, it just needs to be executed. In this style we essentially say: "Hey computer do this, then that, and also this and later that." There is not much thought put into it.

> If you ever read about different "programming paradigms", you might we wondering how that relates to this. Actually, it's the exact same thing as a "programming style", it's just a fancier name for it.

However, in the evolution of programming languages programmers started to think more about code organization. This is how different programming styles have evolved. The fundamental question people asked was: **how can we make writing code more organized and reusable?**

In this week you'll be exposed to one such programming style that evolved: `object oriented programming` (or OOP for short). OOP is a fundamentally different way of writing software: instead of breaking up a problem in variables and functions that operate on those variables, we break problems up into "entities" that interact with each other.

> Just to make sure you completely get the idea here: OOP is about a different way of thinking about how to write software. The concepts of variables, functions, promises, API (calls) and error handling all still apply. It's just that the way code is organised is different. Instead of creating long procedures, we create objects that interact with each other.

For further study, check the following:

- [Computer programming: What is object-oriented language?](https://www.youtube.com/watch?v=SS-9y0H3Si8)
- [Object-oriented programming — the basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS#Object-oriented_programming_%E2%80%94_the_basics)

### A different way of thinking

OOP is a set of ideas on how to approach writing software. At the core of it we're trying to think about a computer program in a way that's similar to the real world.

Instead of writing loose variables and functions, we try to group them together into categories: in OOP we call this a `class`. Each class serves as a **template/blueprint**, and represents a real-world entity (like a person, animal or vehicle)

![OOP Classes](../assets/OOP.png)

A class consists of 3 things: (1) an identity, (2) attributes, and (3) behavior.

```js
class Person {}
```

When defined like above, it's merely a definition. It's not an `instance` of it. Or in other words: it's just a new category, not yet a real person.

### 4 pillars of OOP

Almost anything that evolves within programming does so to solve a certain problem. HTML was developed to make document sharing over the Internet simple and straightforward. CSS was developed to make documents more user-friendly.

The problems that OOP tries to solve is the question we saw before: how can we write code in an organized and reusable fashion?

The answer that OOP gives us can be summarised in 4 pillars. To illustrate these pillars let's use a simple example:

```js
const person = {
  name: 'Mohammad',
  age: 28,
  walk() {
    return `${this.name} is walking!`;
  },
};
```

1. **Encapsulation**: In the example data and operations (that manipulate that data)are grouped together. This is called `encapsulation`. The main benefit is that this keeps our code organised. The second benefit is that putting objects inside of a 'capsule' we can prevent direct manipulation by outside sources, this is called `data hiding`. This reduces dependencies between objects, so that change in one place doesn't affect the rest of the application.

2. **Abstraction**: Let's say we had a Complexity of logic hidden away, creating a simpler interface (remote controller to a tv). Only expose the essentials. Abstracting away complexities to create an easier to use element.

3. **Inheritance**: eliminates redundant code by inheriting properties and methods in new instances. This encourages code reusability.

4. **Polymorphism**: an object can have many forms of expression, depending on the context. Let's say we inherit

Any class that exists or is made follows these pillars.

For further study check out the following resources:

- [How to explain object-oriented programming concepts to a 6-year-old](https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/)
- [JavaScript OOP Crash Course (ES5 & ES6)](https://www.youtube.com/watch?v=vDJpGenyHaA)
- [Object-Oriented Programming & Classes](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/oop_classes.md)

## 2. ES6 Classes

### Data structures revisited

Programming is about 2 things: **information** and **communication of that information**. Everything else flows from those two basic ideas. In programming we take this idea of "information" apart and categorize it into what we call `data structures`. Each data structure breaks down "information" in a specific category, for example for words we use `strings`. For numbers we use `numbers`.

### Objects

In JavaScript, objects are special. In your programming so far you most likely have created objects like this:

```js
const anObj = {
  name: 'Cool Object',
};
```

This is called an `object literal`, and it's a valid way of creating an object. However, writing it like this "abstracts away" a lot of what's happening behind the scenes.

> To abstract away refers to intentionally hiding the details of how something complex works in order to simplify things conceptually. For example, the remote to your television is a complex device, but all of this is abstracted away so you don't have to deal with it. You just press the ON button and it works.

You can write the same thing by using the Object `constructor function`.

```js
const anObj = new Object();
anObj.name = 'Cool Object';
```

Well, what is a constructor function? To understand that we need to start at the beginning first: `factory functions`.

### Factory functions

If we want to create an object we can just use an `object literal` and we're done. But what if we want to create hundreds of copies (or as we say in programming, 'instances') of that same object?

For that we use `factory functions`. Don't let the name mislead you though, a factory function is just a regular function. However, the single differentiating factor is that it always returns an object instance: it is a factory that produces object instances, hence the name `factory function`. Here's an example:

```js
// Defining a blueprint for a person:
function createPerson(name, age) {
  var obj = {
    name: name,
    age: age,
    walk: function() {
      console.log(`${this.name} is walking!`);
    },
  };
  // other code to manipulate our object in some way here
  return obj;
}
```

This is the most simple way of defining a `template`/`blueprint`/`class` (these are all synonyms in this context) and creating object instances from it. Now every time we call this function we're creating a new person object.

```js
const noer = createPerson('Noer', 27);
const wouter = createPerson('Wouter', 33);
const federico = createPerson('Federico', 32);
```

Go through the following to learn more about factory functions:

- [The Factory Pattern](https://www.youtube.com/watch?v=0jTfc4wY6bM)
- [JavaScript Factory Functions](https://www.youtube.com/watch?v=jpegXpQpb3o)

### Constructor functions

`Constructor functions` are ordinary functions that have a special purpose: to create object instances. You can consider them the more advanced version of `factory functions`.

Here's an example:

```js
// // Defining a blueprint for a person:
function Person(name, age) {
  this.name = name;
  this.age = age;
}
```

The difference with a factory function is the way to instantiate it. Instead of just calling it we have to use the keyword `new`, like so:

```js
const noer = new Person('Noer', 27);
```

Learn more about constructor functions:

- [JavaScript Constructor Functions](https://www.youtube.com/watch?v=23AOrSN-wmI)
- [Constructors and object instances](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS#Constructors_and_object_instances)

### Classes

As you've learned in the previous section, we can create a category of objects using `factory or constructor functions`.

Since ES6 we can make use of the `class` keyword, which is a way to create constructor objects as well. It's essentially the same thing as a constructor function, only written in a clearer and more straightforward way. You can call it an upgrade to constructor functions (similar to how Promises are an upgrade to callbacks, as you've learned before).

Go through the following to learn more about this:

- [The Class](https://www.youtube.com/watch?v=sJvPXb_lmPE)
- [An overview of ES6 classes](https://thecodebarbarian.com/an-overview-of-es6-classes)

## 3. Async/Await

Last week you learned about Promises. To recap, here's what we learned: in order to introduce **asynchronicity** in our applications we use `callbacks`.

```js
const someFunc(param1, callback) {
  const callback(param1);
  return;
}
```

Then we learned about how Promises are an improvement upon callbacks, by providing the developer with a more readable syntax that avoids **callback hell**. We can call them callbacks version 2.0. Here's the basic structure again:

```js
new Promise(reject, resolve).then(...);
```

And now we've arrived at the latest upgrade of the callback mechanism: `async/await`. This construct is part of **ECMAScript 6** and its main benefit is to make using callbacks even more readable. Here's how it might look in action:

```js
async fetchData () {
  const fetchedData = await fetch('https://randomuser.me/api/');
  const parsedData = await fetchedData.json();
  return parsedData;
}
```

How do we use it? We put the keyword `async` in front of the function declaration that will contain asynchronous code. Then in every line that returns the Promise we put the keyword `await` in front. That's it.

For more research, check the following resources:

- [The Evolution of Callbacks, Promises & Async/Await](https://www.youtube.com/watch?v=gB-OmN1egV8)
- [Async JS Crash Course - Callbacks, Promises, Async/Await](https://www.youtube.com/watch?v=PoRJizFvM7s)

### Error handling

As you might have noticed, the Async/Await doesn't give us a way to do error handling like it does in the Promise object.

In the Promise object we are given access to the `catch()` function, a function whose sole job it is to "catch errors". "Catching errors" is a phrase developers use to indicate various things:

1. that a line of code has caused an error
2. that the program has shutdown to prevent any other errors from happening
3. that the application gives feedback to the developer and/or user

In the Promise object, we can use the function `catch` to take care of errors. It takes in a callback, which automatically receives an error object. Here's an example:

```js
Promise.catch(function(error) {
  console.log(error);
});
```

With the Async/Await construction, we don't get that. So instead we have to use some other solution: the `try... catch` block. It's also an addition to the language, given to us by **ECMAScript 6**:

```js
try {
  // This function will run. If anything goes wrong...
  async fetchData () {
    const fetchedData = await fetch('https://randomuser.me/api/');
    const parsedData = await fetchedData.json();
    return parsedData;
  }
} catch (err) {
  // ...the code in this block will execute. The error that has been created will now be inserted into `err`
  console.log('oops, something went wrong!', err);
}
```

Learn more about it here:

- [JavaScript Try Catch & Error Handling ES6 Tutorial](https://www.youtube.com/watch?v=ye-aIwGJKNg)
- [Error handling, "try..catch"](https://javascript.info/try-catch)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
