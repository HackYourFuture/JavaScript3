# Reading Material JavaScript3 Week 3

## Agenda

These are the topics for week 3:

1. Object-Oriented Programming (OOP)
   - 3 main paradigms
   - A different way of thinking
   - 4 pillars of OOP
2. ES6 Classes
   - Data structures revisited
   - Objects
   - Factory functions
   - Constructor functions
   - Classes
3. Async/Await
   - Catching errors with try/catch
4. Thinking like a programmer III

## 0. Video Lectures

Your teacher Stasel has made video lectures for this week's material. You can find them here: [Videos 9 - 10](https://www.youtube.com/playlist?list=PLVYDhqbgYpYVchJ9QQ3rC2WxYKrOiceYX)

<a href="https://www.youtube.com/playlist?list=PLVYDhqbgYpYVchJ9QQ3rC2WxYKrOiceYX" target="_blank"><img src="../assets/stasel.png" width="600" height="350" alt="HYF Video" /></a>

## 1. Object-Oriented Programming (OOP)

So far we've learned about various programming concepts. These are the basics of what makes up any application: it's the **WHAT** of writing applications. However, now that you're familiar with them it's time to go to the next level: the **HOW** of writing applications.

Like in any field, you first have to master the basics before you can create your own style of creating something new. Let's say that you want to start playing a musical instrument: the piano. At first you have to learn the basics: the different scales, notes, melodies, tempo (music basics), then you have to learn how to compose songs (writing notes in the correct order). Once you understand all of that is it time to learn a specific **style** of composing songs.

It's the same way with programming. At first you're learning about variables, functions, loops, etc. (the basics), then you learn how to build applications (writing code in the correct order). Once you've learned all of this you can start thinking about the **style** of building applications.

### 3 main styles (paradigms)

There are 3 big programming styles (or to use a fancier term: paradigms) popular right now:

1. Procedural
2. Object-Oriented
3. Functional

Up until now you implicitly learned a basic way of writing code, called `procedural programming`. In this style we break problems up into functions and variables, and execute them as one long procedure. There is no real thought behind code organization or reusability, it just needs to be executed. In this style we essentially say: "Hey computer do this, then that, and also this and later that." There is not much thought put into it.

Take this example:

```js
const numbers = [14, 5, 25, 8];

const filterDoubleDigits = numbers => {
  return numbers.filter(number => {
    return number < 10;
  });
};

filterDoubleDigits(numbers);
```

Every line is executed, and this works. However, there is no real organization to the lines. This is ok when your code base is small.

But what if your application counts 1000's of lines of code?

You can imagine that reading and understanding what's happening is going to be much more difficult then.

As software increases in complexity, files become bigger and contain more code. The logical rules also become increasingly more complex. This has led programmers to start thinking more about code organization. As a result different programming styles (paradigms) have evolved.

The fundamental question people asked was: **how can we make writing code more organized and readable?**

### A different way of thinking

Object Oriented Programming (OOP) is another style (or paradigm) of building applications. It's not a language, technology or tool: it's a **set of ideas on how to approach writing software**.

Instead of writing loose variables and functions, we try to group them together in order to create entities. An example of an entity is a Person, Animal or Vehicle. By having different entities we can make them "talk to each other"!

The central question asked in OOP is this: **how can we structure our applications in a way that reflects the real world?**

> Just to make sure you completely get the idea here: OOP is about a different way of thinking about how to write software. The concepts of variables, functions, promises, API (calls) and error handling all still apply. It's just that the way code is organised is different. Instead of creating long procedures, we create objects that interact with each other.

For further study, check the following:

- [Computer programming: What is object-oriented language?](https://www.youtube.com/watch?v=SS-9y0H3Si8)
- [Object-oriented programming — the basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS#Object-oriented_programming_%E2%80%94_the_basics)

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

A `class` is an essential idea within OOP: it's a **blueprint/template** of an entity. When we define a class we give it properties and behaviors. For example, a Person class can have a `name`, `age` and `gender`; these are the properties of the Person. Additionally, a Person can also `talk`, `walk` `sleep`; these are the behaviors of the Person.

![OOP Classes](../assets/OOP.png)

Let's take an example of a class, written in ES6 syntax:

```js
class Person {
  constructor(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }

  talk(sentence) {
    console.log(sentence);
  }

  sleep() {
    console.log('Zzzzzzzzz....');
  }
}
```

When defined like above, it's merely a definition. It's not an `instance` of it. Or in other words: it's a new blueprint we've created, but not yet a real person.

To create a real Person, we have to `instantiate` it:

```js
const aisha = new Person('Aisha', 25, 'Female');

aisha.talk('Hi! My name is Aisha!'); // Result: Hi! My name is Aisha!
```

> An ES6 class is essentially the same thing as a constructor function, only written in a clearer and more straightforward way. You can call it an upgrade to constructor functions (similar to how Promises are an upgrade to callbacks).

Go through the following to learn more about classes:

- [Object Oriented JavaScript With ES6: The Class](https://www.youtube.com/watch?v=sJvPXb_lmPE)
- [An overview of ES6 classes](https://thecodebarbarian.com/an-overview-of-es6-classes)

## 3. Async/Await

Last week you learned about Promises. To recap, here's what we learned: in order to introduce **asynchronicity** in our applications we use `callbacks`. This allows us to perform multiple operations simultaneously, i.e. fetch data while a user is still able to navigate the page.

At first we learned about callbacks, as a way to do this:

```js
function someFunc(param1, callback) {
  const result = callback(param1);
  return result;
}
```

Then we learned about how Promises are an improvement upon callbacks, by providing the developer with a more readable syntax that avoids **callback hell**. Here's the basic structure again:

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

How do we use it? We put the keyword `async` in front of the function declaration that will contain asynchronous code. Then in every line that returns a Promise we put the keyword `await` in front. That's it.

For more research, check the following resources:

- [The Evolution of Callbacks, Promises & Async/Await](https://www.youtube.com/watch?v=gB-OmN1egV8)
- [Async JS Crash Course - Callbacks, Promises, Async/Await](https://www.youtube.com/watch?v=PoRJizFvM7s)

### Catching errors

As you might have noticed, the `async/await` keywords don't give us a way catching errors like it does in the Promise object.

But before we get into that, we should define "catching errors" a little bit. By "catching errors" we mean:

1. that a line of code has caused an error (because of incorrect syntax or data type)
2. that the program has shutdown to prevent any other errors from happening
3. that the application gives feedback to the developer and/or user about where the error came from

In the Promise object, we can use the function `catch` to take care of errors. It takes in a callback, which automatically receives an error object. Here's an example:

```js
Promise.catch(function(error) {
  console.log(error);
});
```

With the `async/await` keywords, we don't get a `catch` function to use. So instead we have to use some other solution: the `try... catch` block. It's also an addition to the language, given to us by **ECMAScript 6**:

```js
  // This function will run. If anything goes wrong...
  async fetchData () {
    try {
    const fetchedData = await fetch('https://randomuser.me/api/');
    const parsedData = await fetchedData.json();
    return parsedData;
    } catch (err) {
      // ...the code in this block will execute. The error that has been created will now be inserted into `err`
      console.log('Oops, something went wrong!', err);
    }
  }
```

Learn more about it here:

- [JavaScript Try Catch & Error Handling ES6 Tutorial](https://www.youtube.com/watch?v=ye-aIwGJKNg)
- [Error handling, "try..catch"](https://javascript.info/try-catch)

## 4. Thinking like a programmer III

As our applications grow bigger, they increase in complexity. This can make our programs harder to understand. In order to make things as clear and easy to understand as possible, we need to regularly tidy up our code. In the industry we call this act `refactoring`. The result of this is what we like to call `clean code`.

- (Code Refactoring)[https://www.youtube.com/watch?v=vhYK3pDUijk]
- (Refactoring JavaScript with pipeline style programming)[https://www.youtube.com/watch?v=38q7aSu52NY]

As a great programmer, you always want to be writing clean code. This means: code that's well-organized in small files that you can easily read and understand in order to comprehend what the application is trying to do.

There are many ways to write clean code. Some of them you might have heard: Don't Repeat Yourself (DRY) or Keep It Simple, Stupid (KISS) are two things to keep in mind. There are many others and you are encouraged to do your own research!

Here are already a couple of them to get you started:

- [Top 5 Programming Principles that any software engineer should follow](https://www.youtube.com/watch?v=d-KbEQM0724)
- [Programming Terms: DRY (Don't Repeat Yourself)](https://www.youtube.com/watch?v=IGH4-ZhfVDk)
- [The KISS Principle in Software Development — Everything You Need to Know](https://medium.com/@devisha.singh/the-kiss-principle-in-software-development-everything-you-need-to-know-dd8ea6e46bcd)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
