# Reading Material JavaScript3 Week 3

## Agenda

These are the topics for week 3:

1. Object-Oriented Programming (OOP)
   - A different way of thinking
   - 4 pillars of OOP
2. ES6 Classes
   - Factory functions
   - Constructor functions
   - Classes
3. Async/Await
   - Error handling

## 1. Object-Oriented Programming (OOP)

So far we've learned about various programming concepts. These are the basics of what makes up any application: it's the **WHAT** of programming. However, now that you're familiar with them it's time to go to the next level: the **HOW** of programming.

Like in any field, you first have to master the basics before you can create your own style of creating something new. Let's say that you want to start playing a musical instrument: the piano. At first you have to learn the basics: the different scales, notes, melodies, tempo (music basics), then you have to learn how to compose songs (the piano applied to songs). Once you understand all of that is it time to learn a specific style of playing piano: .

It's the same way with programming.

Up until now you implicitly learned a basic way of writing code, called `procedural programming`. In this paradigm we break problems up into functions and variables, and execute them as one long procedure. There is no real thought behind code organisation or reusability, it just needs to be executed.

In this week you'll be exposed to a different **style** of programming: `object oriented programming` (or OOP for short). OOP is a fundamentally different way of writing software: instead of breaking up a problem in variables and functions that operate on those variables, we break problems up into "entities" that interact with each other.

> Just to make sure you completely get the idea here: OOP is about a different way of thinking about how to write software. The concepts of variables, functions, promises, API (calls) and error handling all still apply. It's just that the way code is organised is differently. Instead of creating long procedures, we create objects that interact with each other.

For further study, check the following:

- [Computer programming: What is object-oriented language?](https://www.youtube.com/watch?v=SS-9y0H3Si8)
- [Object-oriented programming — the basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS#Object-oriented_programming_%E2%80%94_the_basics)

### A different way of thinking

OOP is a set of ideas on how to approach writing software. At the core of it we're trying to think about a computer program in a way that's similar to the real world.

Instead of writing loose variables and functions, we try to group them together into categories: in OOP we call this a `class`. Each class serves as a **template/blueprint**, and represents a real-world entity.

![OOP Classes](../assets/OOP.png)

Let's say we're running a business: a chicken restaurant. What does this business consist of? On the business side we could have

A class consists of 3 things: (1) an identity, (2) attributes, and (3) behavior. The identity is the name of the entity.

```js
const Person = function() {};
```

We're putting data and functionality together, . This is not the same thing as (an instance of) the object itself, but just a blueprint that can be used to make an object.

Let's take an example:

### 4 pillars of OOP

Almost anything that evolves within programming does so to solve a certain problem. HTML was developed to make document sharing over the Internet simple and straightforward. CSS was developed to make documents more user-friendly. 

The problems that OOP tries to solve can be summarised in the following 4 pillars:

1. **Encapsulation**: bundling data and operations (that manipulate that data) together, and data hiding. Putting objects inside of a 'capsule' we can prevent direct manipulation by outside sources. Reducing dependencies between objects, so that change in one place doesn't affect the rest of the application.

2. **Abstraction**: Complexity of logic hidden away, creating a simpler interface (remote controller to a tv). Only expose the essentials. Abstracting away complexities to create a

3. **Inheritance**: eliminates redundant code by inheriting properties and methods in new instances. This encourages code reusability.

4. **Polymorphism**: an object can have many forms of expression, depending on the context.

All these pillars are combined within a single class instance:

```js
```

For further study check out the following resources:

- [How to explain object-oriented programming concepts to a 6-year-old](https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/)
- [JavaScript OOP Crash Course (ES5 & ES6)](https://www.youtube.com/watch?v=vDJpGenyHaA)
- [Object-Oriented Programming & Classes](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/oop_classes.md)

## 2. ES6 Classes

### Objects

In your programming so far you most likely have created objects like this:

```js
const anObj = {
  name: 'Cool Object',
};
```

This is called an `object literal`, and it's a valid way of creating an object. However, writing it like this abstracts away a lot of what's happening behind the scenes.

In JavaScript, objects are special. They allow us to

### Factory functions

What if we want to create hundreds of object instances?

- [The Factory Pattern](https://www.youtube.com/watch?v=0jTfc4wY6bM)
- [JavaScript Factory Functions](https://www.youtube.com/watch?v=jpegXpQpb3o)

### Constructor functions

- [JavaScript Constructor Functions](https://www.youtube.com/watch?v=23AOrSN-wmI)
- [Constructors and object instances](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS#Constructors_and_object_instances)

### Classes

Like mentioned before, a `class` is a blueprint/template that represents a real-world entity. Whenever we want to create a version of this class, we `instantiate` it: in other words, we're creating a object.

As you've learned in the previous section, in JavaScript we can do this using `factory/constructor function`.

Since ES6 we can

It's essentially the same thing as a constructor function, only written in a clearer and more straightforward way.

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

Then we learned about how Promises are an improved on callbacks, by providing the developer with a more readable syntax that avoids **callback hell**. We can call them callbacks version 2.0.

```js
new Promise(reject, resolve).then(...);
```

And now we've arrived at the latest upgrade of the callback mechanism: `async/await`.

```js
```

- [The Evolution of Callbacks, Promises & Async/Await](https://www.youtube.com/watch?v=gB-OmN1egV8)
- [Async JS Crash Course - Callbacks, Promises, Async/Await](https://www.youtube.com/watch?v=PoRJizFvM7s)

### Error handling

As you might have noticed, the Async/Await doesn't give us a way to do error handling like it does in the Promise object.

In the Promise object we have access to the `catch()` function,

- [JavaScript Try Catch & Error Handling ES6 Tutorial](https://www.youtube.com/watch?v=ye-aIwGJKNg)

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
