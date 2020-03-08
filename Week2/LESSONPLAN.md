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

In the examples `setTimeout` is used to illustrate asynchronous code. In the real world there will be some code doing useful work here, for example `fetch`.

**Callback**
```javascript
let doHomeWork = function (cb) {
  setTimeout(function () {
    if ( true ) 
      cb(); // homework done
    else
      cb('homework not done, too lazy');
  }, 1000);
}


doHomeWork(function (err) {
  if ( err ) 
    console.warn(err);
  else
    console.log('home work is done now');
})
```

**Promise**
```javascript
let promiseToDoHomeWork = new Promise(function (resolve, reject) {
  setTimeout(function () {
    if ( true ) 
      resolve();  // homework done
    else
      reject('homework not done, too lazy');
  }, 1000);
});

promiseToDoHomeWork
  .then(function () { console.log('home work is done now'); })
  .catch(function (err) { console.warn(err); })

```
#### Nested callback/promises example

```javascript
let attendClass = function (cb) {
  setTimeout(function () {
    if ( true ) 
      cb(null, 'I attend the class');
    else
      cb('class not attended, stayed home');
  }, 1000);
}

let doTheHomeWork = function (message, cb) {
  setTimeout(function () {
    if ( true ) 
      cb(null, message + ' then I did the homework');
    else
      cb('homework not done, was lazy');
  }, 1000);
}

let submitHomeWork = function (message, cb) {
  setTimeout(function () {
    if ( true ) 
      cb(null, message + ' so I submit my homework'); 
    else
      cb('homework not submited, github is down');
  }, 1000);
}

// call attendClass, after it is finished call doTheHomeWork then submitHomeWork. In each step pass the output of the previous step. In case of an error show it in the console

attendClass(function (err, data) {
  if ( err ) 
    console.warn(err);
  else
    doTheHomeWork(data, function (err1, data1) {
        if ( err1 ) 
          console.warn(err1);
        else
          submitHomeWork(data1, function (err2, data2) {
            if ( err2 ) 
              console.warn(err2);
            else
              console.log(data2)
          });
    })
})
```
Mention how this nested structure is hard to understand and read. Multiple variables with similar names and error handling is all over the place.
Simulate an error in doTheHomeWork by replacing `if ( true )` with `if ( false )`. 

```javascript

let attendClass = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve('I attend the class');
      else
        reject('class not attended, stayed home');
    }, 1000);
  });
}

let doTheHomeWork = function (message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve(message + ' then I did the homework');
      else
        reject('homework not done, was lazy');
    }, 1000);
  });
}

let submitHomeWork = function (message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve(message + ' so I submit my homework'); 
      else
        reject('homework not submited, github is down');
    }, 1000);;
  });
}

attendClass()
  .then(function (result) {
    return doTheHomeWork(result);
  })
  .then(function (result) {
    return submitHomeWork(result);
  })
  .then(function (result) {
    console.log(result);
  })  
  .catch(function (error) {
    console.warn(error);
  });


```
Simulate an error in doTheHomeWork by replacing `if ( true )` with `if ( false )` and run the example again.

- Promise.all

```javascript
Promise.all([attendClass(), doTheHomeWork(), submitHomework()]).then(function ([res1, res2, res3]) { console.log('all finished') });
```

- Promise.race

```javascript
Promise.race([attendClass(), doTheHomeWork(), submitHomework()]).then(function (result) { console.log('one of them finished') });
```

### Exercise

#### Easy exercise (see difficult exercise alternative below)

**Part 1**
Rewrite the following code to use promise instead of callbacks. *As preparation for `fetch`*

```javascript
{
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=amsterdam&appid=316f8218c0899311cc029a305f39575e`;

function fetchResourceAsCallback(url, cb) {
  const oReq = new XMLHttpRequest();
  oReq.open('GET', url);
  oReq.send();
  oReq.addEventListener('load', function (event) {
    const response = JSON.parse(this.response);
    if (response.code >= 400) {
      // error
      cb("Failed to get because:"+response);
    } else {
      //success
      cb(null, response);
    }
  });
}

fetchResourceAsCallback(WEATHER_URL, 
  function (err, data) {
    if ( err ) 
      console.warn(err);
    else
      console.log(data);
 }
);

function fetchResourceAsPromise(url) {
  // your code goes in here
}

fetchResourceAsPromise(WEATHER_URL).then(function (result) {
  console.log(result);
})
.catch(function (err) {
  console.warn(err);
});
}

```

**Part 2**

Use `Promise.all` to load data for multiple cities in parallel. Ask students to discuss in which scenarios it would be better to load data in parallel. In what scenarios is loading data in parallel not better.

```javascript

const URLS_TO_LOAD = [ 'https://samples.openweathermap.org/data/2.5/weather?q=London&appid=316f8218c0899311cc029a305f39575e', 'https://api.openweathermap.org/data/2.5/weather?q=amsterdam&appid=316f8218c0899311cc029a305f39575e'];
```

* Hint: use `map` to convert from an array of URLs to an array of promises.

**Alternative exercise - Cooking pasta**

**❗❗❗ Difficult exercise ❗❗❗**

> Async can be hard to understand without real live example. Cooking is a great example of mixed synchronous and asynchronous tasks. In this assignment we'll cook pasta with promises 💍


Let's say we want a program to cook some pasta. Some of the steps involved in cooking pasta are:

1. Gathering the ingredients (pasta, garlic, tomatoes, sage, butter)
2. Cutting the garlic
3. Cutting the tomatoes
4. Cooking the water
5. Cooking the pasta
6. Baking the garlic
7. Baking the tomatoes
   X. Mixing the pasta with sauce

If we do this synchronously there is no chance of it becoming a good meal because the pasta would be cold by the time the vegetables are ready. It would also take way too long this way. So let's fix that!

1. Think about how to do this asynchronously; which tasks could be run at the same time? What steps should wait for what other steps? Try to write down a basic recipe (don't write any code yet!)
2. Now convert your recipe to pseudocode (in markdown). The point is to name functions and show which functions call which other functions. The logic should be there but we'll write the code in the next step.
3. Write the actual code using promises. Add timeouts to each task (estimate how many minutes a task would take and then set the timeout to that many seconds so 8 minutes for cooking pasta would be 8 seconds in your programme)
4. Can you get the code to work like you would cook pasta in the kitchen? Try using Promise.all if you want to wait for several tasks to finish.

<!--- Here is my own attempt at completing the exercise. It's actually pretty tough to get the whole thing working with promises so maybe see how far students can get. https://codepen.io/Razpudding/pen/Keygge --->

> Async await really helps simplify asynchronous (promisified) code. The previous example can be improved by applying it.

5. Try rewriting your previous attempt using Async/Await. ⏰🍝⏰

<!--- Here is my solution. It's a lot cleaner than the promises version but could still use some work. Would also be nice if the changes were reflected in the DOM. https://codepen.io/Razpudding/pen/RJZeJO --->

### Essence

- It's the accepted solution to [callback hell](http://callbackhell.com/)
- in terms of features it does not offer something new, everything one can do with promises could also be done with callbacks but it is easier to write and read the code when promises are used

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
- The environment(or scopeis knownich the line is being executed is know as “Execution Context”
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



