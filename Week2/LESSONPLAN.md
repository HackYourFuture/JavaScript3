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
- JS versions https://www.w3schools.com/js/js_versions.asp
    - the javascript language evolves, new things are added and some thing become obsolete
- It's a way to introduce asynchronicity to your application
- Makes asynchronous code read like it's synchronous


In the examples `setTimeout` is used to illustrate asynchronous code. In the real world there will be some code doing useful work here, for example `fetch`.

**Callback**
```javascript
let didFinishHomework = true;
let doHomeWork = function (cb) {
  setTimeout(function () {
    if ( didFinishHomework ) 
      cb(null); // call callback function with NO error and no data
    else
      cb(new Error('homework not done, too lazy')); // call callback function with error
  }, 1000);
}


doHomeWork(function (err) {
  if ( err ) 
    console.warn(err.message);
  else
    console.log('home work is done now');
})
```

**Promise**
```javascript
let didFinishHomework = true;
let promiseToDoHomeWork = new Promise(function (resolve, reject) {
  setTimeout(function () {
    if ( didFinishHomework ) 
      resolve();  // goto then
    else
      reject(new Error('homework not done, too lazy')); // goto catch and pass the error
  }, 1000);
});

promiseToDoHomeWork
  .then(function () { console.log('home work is done now'); })
  .catch(function (err) { console.warn(err); })

```

**!!! Students should watch this video !!!**
- https://youtu.be/RvYYCGs45L4


### Example

#### Nested callback/promises example

```javascript
let attendClass = function (cb) {
  setTimeout(function () {
    if ( true ) 
      cb(null, 'I attend the class'); // call the callback function with no Error and some data
    else
      cb(new Error('class not attended, stayed home')); // call the callback function with an Error
  }, 1000);
}

let didFinishHomework = true;
let doTheHomeWork = function (message, cb) {
  setTimeout(function () {
    if ( didFinishHomework ) 
      cb(null, message + ' then I did the homework'); // call the callback function with no Error and some data
    else
      cb(new Error('homework not done, was lazy')); // call the callback function with an Error
  }, 1000);
}

let submitHomeWork = function (message, cb) {
  setTimeout(function () {
    if ( true ) 
      cb(null, message + ' so I submit my homework');  // call the callback function with no Error and some data
    else
      cb(new Error('homework not submited, github is down')); // call the callback function with an Error
  }, 1000);
}

// call attendClass, after it is finished call doTheHomeWork then submitHomeWork. In each step pass the output of the previous step. In case of an error show it in the console

attendClass(function (err, data) {
  if ( err ) 
    console.warn(err.message);
  else
    doTheHomeWork(data, function (err1, data1) {
        if ( err1 ) 
          console.warn(err1.message);
        else
          submitHomeWork(data1, function (err2, data2) {
            if ( err2 ) 
              console.warn(err2.message);
            else
              console.log(data2)
          });
    })
})
```
Mention how this nested structure is hard to understand and read. Multiple variables with similar names and error handling is all over the place.
Simulate an error in doTheHomeWork by setting `didFinishHomework = false` and run the example again

```javascript

let attendClass = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve('I attend the class'); // goto then and pass the data
      else
        reject(new Error('class not attended, stayed home')); // goto catch and pass the error
    }, 1000);
  });
}

let didFinishHomework = true;
let doTheHomeWork = function (message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve(message + ' then I did the homework'); // goto then and pass the data
      else
        reject(new Error('homework not done, was lazy')); // goto catch and pass the error
    }, 1000);
  });
}

let submitHomeWork = function (message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if ( true ) 
        resolve(message + ' so I submit my homework');  // goto then and pass the data
      else
        reject(new Error('homework not submited, github is down')); // goto catch and pass the error
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
  .catch(function (error) { // catches all errors
    console.warn(error.message);
  });


```
Simulate an error in doTheHomeWork by setting `didFinishHomework = false` and run the example again.

- Promise.all

Imagine that you are cleaning your house. If you are going to to it alone then it will take you the whole day. However if you ask your friend to help then you can be done in half the time.

```javascript
Promise.all([cleanKitchen("Me"), cleanBathroom("friend")]).then(function ([res1, res2]) { console.log('all finished') });
```

- Promise.race

Sometimes I get really hungry. Then I want to eat as soon as possible. So I order a pizza. But I never know how long it will take for the pizza to arrive. And I am really hungry. So I start frying some potatotes. When at one of them is ready either the pizza has arrived or the frites are done then I will eat and I do not have to wait for the other one.

```javascript
Promise.race([fryPotatoes(), orderPizza()]).then(function (food) { console.log('I am eating: '+food) });
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
      cb(new Error("Failed to get because:"+response));/´// call callback function with an error
    } else {
      //success
      cb(null, response); // call callback function with NO error and pass the response
    }
  });
}

fetchResourceAsCallback(WEATHER_URL, 
  function (err, data) {
    if ( err ) 
      console.warn(err.message);
    else
      console.log(data);
 }
);

function fetchResourceAsPromise(url) {
  // your code goes in here
}

fetchResourceAsPromise(WEATHER_URL)
.then(function (result) {
  console.log(result);
})
.catch(function (err) {
  console.warn(err.message);
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
- The environment(or scope) in which the line is being executed is know as “Execution Context”
- The object that `this` refers to, changes every time execution context is changed.
- Whatever is calling the function passes the `this` value to it by default.
- We can pass specific `this` by `.bind`, `.call` or `.apply`
- By default, “this” refers to global object which is `global` in case of NodeJS and `window` object in case of browser

### Example

#### this refers to new instance (constructors)

```javascript
function logColor() {
    // this inside the function refers to the calling javascript object
    console.log('This refers to: ',this); 
    console.log('Color of this is: '+this.color);
}
let dog = { age: 5, color: 'brown', logColor: logColor};
let car = { model: 'bmw', color: 'orange', logColor: logColor };

console.log('log color called with dog')
dog.logColor();
console.log('log color called with car')
car.logColor();
```

- In Javascript, property of an object can be a method or a simple value.
- When an Object’s method is invoked then “this” refers to the object which contains the method being invoked.


#### “this” refers to global object
```javascript
function logColor() {
    // this inside the function refers to the calling javascript object
    console.log('This refers to: ',this); 
    console.log('Color of this is: '+this.color);
}

console.log('log color called with no object')
logColor(); // no calling object so "this" refers to window by default
```
> Note: the value of “this” depends on how a method is being invoked as well.

####  “this” with call, apply methods 
- These methods can be used to set custom value of `this` to the execution context of function, also they can pass arguments/parameters to the function

```javascript
function logColor() {
    // this inside the function refers to the calling javascript object
    console.log('This refers to: ',this); 
    console.log('Color of this is: '+this.color);
}
let cat = { likes: 'milk', color: 'white'};
logColor.call(cat); // calls the logColor function with cat as "this"
```

#### “this” with bind method
`bind` only create a copy of the function with the binded `this` inside without calling the function.
```
function callAfterOneSecond(cb) {
   setTimeout(function () {
      cb();
   }, 1000);
}
function logColor() {
    // this inside the function refers to the calling javascript object
    console.log('This refers to: ',this); 
    console.log('Color of this is: '+this.color);
}
let cat = { likes: 'milk', color: 'white'};
let boundLogColor = logColor.bind(cat); // returns a function that can be executed later
console.log(boundLogColor);
// a few lines later
boundLogColor(); // executes logColor with cat as "this"

// callAfterOneSecond(boundLogColor);
```


> Note: If `strict mode` is enabled for any function then the value of “this” will be “undefined” as in strict mode, global object refers to undefined in place of windows object.

```
function foo() {
  'use strict';
  console.log("Simple function call")
  console.log(this === window);
}

foo();	//prints false on console as in “strict mode” value of “this” in global execution context is undefined.
```

#### “this” in arrow functions
- The `this` value inside the arrow function gets binded and calculated and assigned based on its wrapper/container/parent `this` value.
- The methods call(), apply(), and bind() will not change the value of this in arrow functions

Students will learn mroe about this when learning about classes in javascript.


### Excercise
In this excercise, let the students guess the result and then go line by line as if you were an interpreter and execute the code. Or use the debugger tools on devtools to execute line by line.


```javascript
let user = {
  a: 2,
  b: 3,
  print: function () {
    console.log(multiply(this.a, this.b));
  }
}
user.a = 5;
user.print();
user.b = 10;
function multiply(p, q) {
  return p * q;
}
```

Variant two (if students find variant one too easy)

```javascript
let user = {
  a: 2,
  b: 3,
  print: function () {
    multiply(this.a, this.b, function (total) {
      console.log(total);
      console.log(this.a * this.b);
    })
  }
}
user.a = 5;
user.print()
user.b = 10;
function multiply(p, q, callback) {
  callback(p * q);
}
```

### Essence
this is special keyword in javascript. this refers to different things depending on how a function is called.



