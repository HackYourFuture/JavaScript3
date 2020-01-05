# Lesson Plan JavaScript3 Week 2

## Agenda

The purpose of this class is to introduce to the student:

- How to use the `fetch` API to do AJAX calls
- The structure and use of `Promises`
- The `this` keyword and its relationship with `scope`

## Core concepts

FIRST HALF (12.00 - 13.30)

## 1. Promises

### Explanation
- It's a way to introduce asynchronicity to your application
- Makes asynchronous code read like it's synchronous
### Example
```javascript
let promiseToDoHomeWork = new Promise(function (resolve, reject) {
  let isDone = true;

  if (isDone) {
    resolve('homework is done!');
  } else {
    reject('not done!');
  }
});

promiseToDoHomeWork
  .then(function () { console.log('home work is done now'); })
  .catch(function () { console.log('home work has something wrong, can\'t be done'); })

```
- Nested promises example

```javascript

let attendClass = function () {
  return new Promise(function (resolve, reject) {
    resolve('I attend the class');
  });
}

let doTheHomeWork = function (message) {
  return new Promise(function (resolve, reject) {
    resolve(message + 'then I did the homework');
  });
}

let submitHomework = function (message) {
  return new Promise(function (resolve, reject) {
    resolve(message + 'so I submit my homework');
  });
}

attendClass()
  .then(function (result) {
    return doTheHomeWork(result);
  })
  .then(function () {
    return submitHomework(result);
  }).catch(function (error) {
    console.log(error);
  });

```


- Promise.all

```javascript
Promise.all([attendClass(), doTheHomeWork(), submitHomework()]).then(function ([res1, res2, res3]) { console.log('all finished') });
```

- Promise.race

```javascript
Promise.race([attendClass(), doTheHomeWork(), submitHomework()]).then(function (result) { console.log('one of them finished') });
```

- Example for converting XHR to promise as a preparation for `fetch`

```javascript
function fetchResource(url) {
  return new Promise(function (resolve, reject) {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', url);
    oReq.send();
    oReq.addEventListener('load', function (event) {
      const data = JSON.parse(this.response);
      if (data.cod >= 400) {
        // error
        console.log('error', data);
        reject(data);
      } else {
        //success
        console.log('success', data);
        resolve(data);
      }
    });
  });
}

fetchResource(`https://api.openweathermap.org/data/2.5/weather?q=amsterdam&appid=316f8218c0899311cc029a305f39575e`).then(function (result) {
  console.log(result);
});

```

### Excercise

### Essence

- It's the accepted solution to [callback hell](http://callbackhell.com/)


## 2. How to use the `fetch` API to do AJAX calls

### Explanation
- Modern replacement of XMLHttpRequest
- Uses Promise structure
- The Fetch API is defined in the browser (window.fetch)
- Only modern browsers support it (show [caniuse.com](https://caniuse.com/#feat=fetch))
- Fetch API documentations by mozilla [link](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
### Example

### Excercise
```
fetch('https://seriousnews.com/api/headlines')
  .then(function (response) {
    response.json();
  }).then(headlines => {
    console.log(headlines)
  }).catch(error => console.log(error));
```
### Essence

SECOND HALF (14.00 - 16.00)

## 3. The `this` keyword and its relationship with `scope`

### Explanation
- The environment(or scope) in which the line is being executed is know as “Execution Context”
- The object that `this` refers to, changes every time execution context is changed.
- Whatever is calling the function passes the `this` value to it by default.
- We can pass specific `this` by `.bind`, `.call` or `.apply`
- By default, “this” refers to global object which is `global` in case of NodeJS and `window` object in case of browser

### Example
#### “this” refers to global object
```javascript
// Immediately Invoked Function Expression (IIFE)
(function () {
  // First Example
  function foo() {
    console.log("Simple function call");
    console.log(this === window);
  }

foo();	//prints true on console
console.log(this === window) //Prints true on console.

})();
```

As you see in the example, the `foo()` function is called based on `window`, this makes the default `this` inside this `foo` function get the value `window` 

> Note: we say a function is called based on window when there's no object calling it, like `obj.foo()`, but calling `foo()` acts if it was `window.foo()`

> Note: If `strict mode` is enabled for any function then the value of “this” will be “undefined” as in strict mode, global object refers to undefined in place of windows object.

```
function foo() {
  'use strict';
  console.log("Simple function call")
  console.log(this === window);
}

foo();	//prints false on console as in “strict mode” value of “this” in global execution context is undefined.
```

#### this refers to new instance (constructors)

```javascript
function Person(fn, ln) {
  this.first_name = fn;
  this.last_name = ln;

  this.displayName = function () {
    console.log(`Name: ${this.first_name} ${this.last_name}`);
  }
}

let person = new Person("John", "Reed");
person.displayName();  // Prints Name: John Reed
let person2 = new Person("Paul", "Adams");
person2.displayName();  // Prints Name: Paul Adams
```

- In Javascript, property of an object can be a method or a simple value.
- When an Object’s method is invoked then “this” refers to the object which contains the method being invoked.

```javascript

function foo() {
  'use strict';
  console.log("Simple function call")
  console.log(this === window);
}

let user = {
  count: 10,
  foo: foo,
  foo1: function () {
    console.log(this === window);
  }
}

user.foo()  // Prints false because now “this” refers to user object instead of global object.
let fun1 = user.foo1;
fun1() // Prints true as this method is invoked as a simple function.
user.foo1()  // Prints false on console as foo1 is invoked as a object’s method
```

> Note: the value of “this” depends on how a method is being invoked as well.

####  “this” with call, apply methods 
- These methods can be used to set custom value of `this` to the execution context of function, also they can pass arguments/parameters to the function

```
function Person(fn, ln) {
  this.first_name = fn;
  this.last_name = ln;

  this.displayName = function (prefix) {
    console.log(`Name: ${prefix} ${this.first_name} ${this.last_name}`);
  }
}

let person = new Person("John", "Reed");
person.displayName(); // Prints Name: John Reed
let person2 = new Person("Paul", "Adams");
person2.displayName(); // Prints Name: Paul Adams

person.displayName.call(person2, 'Mr'); // Here we are setting value of this to be person2 object
person.displayName.call(person2, ['Mr']); // Here we are setting value of this to be person2 object

```

#### “this” with bind method
`bind` only create a copy of the function with the binded `this` inside without calling the function.
```
function Person(fn, ln) {
  this.first_name = fn;
  this.last_name = ln;

  this.displayName = function () {
    console.log(`Name: ${this.first_name} ${this.last_name}`);
  }
}

let person = new Person("John", "Reed");
person.displayName(); // Prints Name: John Reed
let person2 = new Person("Paul", "Adams");
person2.displayName(); // Prints Name: Paul Adams

let person2Display = person.displayName.bind(person2);  // Creates new function with value of “this” equals to person2 object
person2Display(); // Prints Name: Paul Adams
```
### Excercise
### Essence


## 4. Arrow functions and JS versions

### Explanation
- JS versions https://www.w3schools.com/js/js_versions.asp
-  Arrow functions can’t be used as constructors as other functions can.
- If you attempt to use new with an arrow function, it will throw an error.
- To create class-like objects in JavaScript, you should use the new ES6 classes instead

The this keyword works differently in arrow functions.

- The `this` value inside the arrow function gets binded and calcuated and assigned based on its wrapper/container/parent `this` value.
- The methods call(), apply(), and bind() will not change the value of this in arrow functions
### Example
```javascript
// ES5
var multiplyES5 = function (x, y) {
  return x * y;
};

// ES6
const multiplyES6 = (x, y) => { return x * y };
```
#### “this” with fat arrow function
```javascript
function Person(fn, ln) {
  this.first_name = fn;
  this.last_name = ln;

  this.displayName = () => {
    console.log(this === window);
    console.log(`Name: ${this.first_name} ${this.last_name}`);
  }
}

let person1 = new Person('Nouran', 'Mhmoud');
person1.displayName(); // this doesn't equal window, because it gets `this` that is inside Person() constructor function.
```

In the following example, the foo1() gets the `window` as `this` value, because on interpretation time, the interpreter assign the `this` immediately based on the surrounding execution context which is `window` in the case of simple literal object.

```javascript
let user = {
  count: 10,
  foo1: () => {
    console.log(this === window);
  }
}

let user1 = user.foo1() // this equals window
```

### Excercise
In this excercise, let the students guess the result and then go line by line as if you were an interpreter and execute the code. Or use the debugger tools on devtools to execute line by line.

```javascript
function multiply(p, q, callback) {
  callback(p * q);
}

let user = {
  a: 2,
  b: 3,
  findMultiply: function () {
    multiply(this.a, this.b, function (total) {
      console.log(total);
      console.log(this === window);
    })
  }
}

user.findMultiply();
//Prints 6
//Prints true
```
### Essence



