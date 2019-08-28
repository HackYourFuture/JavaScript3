# OOP Crash Course

This README is a companion to Brad Traversy's YouTube [JavaScript OOP Crash Course (ES5 & ES6)](https://www.youtube.com/watch?v=vDJpGenyHaA&t=1055s). It describes how one of the key concepts of Object Oriented Programming, **inheritance**, is implemented in JavaScript. Both explicit (pre-ES6) **prototype-based inheritance** as well as ES6 **classes-based inheritance** is covered. However, the principles of OOP itself are not discussed in this document.

Note that it is not necessary in your daily programming to have full knowledge of all the finer details of prototypal inheritance. As can be seen in this document those details can quickly become rather complex. An overall awareness of the concept of a **prototype** chain as the underlying infrastructure for supporting inheritance will suffice.

What _is_ important is that you understand the **ES6 class syntax** and how to implement a **class inheritance** with the  **extends** keyword (see **6_classes** and **7_subclasses** below).

>Note: The names of the sections below correspond to the equally named JavaScript example files.

To run the code:

1. Open **index-all.html** by right-clicking the file in the VSCode Explorer and select **Open with Live Server**.
2. Open the Chrome Developer Tools console. 
3. Select the file to run from the select box.

To examine a particular example in the Chrome Developer Tools, modify **index.html** to load the desired JavaScript file and open **index.html** in the browser.

## 1_basics_literals

This is the most direct way of 'manually' creating objects and does not introduce any new concepts. 

## 2_constructors

Prior to ES6, prototypal inheritance required the use of **constructor** functions. These are regular JavaScript functions that are intended to be used in combination with the `new` keyword. By convention, constructor function names start with an upper case letter (CamelCase).

When a function is called with `new`, its `this` value will be set to an empty object. By default, this empty object is linked through its **prototype chain** to [`Object.prototype`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#Object_instances_and_Object_prototype_object) (which in itself is an object). That is why methods such as `.hasOwnProperty()` and `.toString()` can be called on _any_ object: they are defined on `Object.prototype`. This is illustrated in Figure 1 below which corresponds to the following code snippet:

```js
function Book(title, author, year) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.getSummary = function() {
    //...
  };
}

const book1 = new Book('Book One', 'John Doe', 2013);
const book2 = new Book('Book Two', 'Jane Doe', 2016);
```

In this example, each **Book** object gets, in addition to its data properties, its own copy of the `.getSummary()` method. This is wasteful in both memory space and execution time. Instead, shared functions should be assigned to the prototype of the constructor function, as will be shown in the next section.


![2_constructor](./assets/2_constructor.png)
Figure 1. Prototypal linkage and the prototype chain.

Note that all object instances created with the same constructor function share a single copy of the function's prototype object:

```js
book1.__proto__ === Book.prototype // true
book2.__proto__ === Book.prototype // true
```

Output from `console.log(book1)`:

```
Book {title: "Book One", author: "John Doe", year: 2013, getSummary: ƒ}
  author: "John Doe"
  getSummary: ƒ ()
  title: "Book One"
  year: 2013
  __proto__:
    constructor: ƒ Book(title, author, year)
    __proto__:
      constructor: ƒ Object()
      hasOwnProperty: ƒ hasOwnProperty()
      isPrototypeOf: ƒ isPrototypeOf()
      ...
```

## 3_prototypes

Functions assigned to the prototype of the constructor function are shared across all object instances created with that same constructor function, as shown in Figure 2.

```js
function Book(title, author, year) {
  this.author = author;
  this.title = title;
  this.year = year;
}

Book.prototype.getSummary = function() {
  //...
};

Book.prototype.getAge = function() {
  //...
};

Book.prototype.revise = function(newYear) {
  //...
};

const book1 = new Book('Book One', 'John Doe', 2013);
const book2 = new Book('Book Two', 'Jane Doe', 2016);
```

![3_prototypes](./assets/3_prototypes.png)
Figure 2. Methods defined in the prototype of the constructor function are shared by all object instances.

When calling a method (using dot notation) on an object, JavaScript will first look on the object itself for the method. If not found, it will inspect the **prototype** of the object (using its `__proto__` property). If still not found it will go to the next prototype in the chain, and so on, ultimately arriving at `Object.prototype` for a final inspection.

For instance, the method `.getSummary()` is not found on the `book1` object. Following the prototype chain, JavaScript finds it on `Book.prototype`. In another example, `.toString()` is not found on the `book1` object, nor on its `Book.prototype`. It _is_ however found on `Object.prototype`.

But if we attempt to call a `.turnPage()` method on `book1` JavaScript will not find it on the object itself, nor anywhere on its prototype chain. Consequently, JavaScript will throw a run time error:

```js
book1.turnPage(); // Uncaught TypeError: book1.turnPage is not a function
```

Output from `console.log(book1)`:

```
Book {title: "Book One", author: "John Doe", year: 2013}
  author: "John Doe"
  title: "Book One"
  year: 2013
  __proto__:
    getAge: ƒ ()
    getSummary: ƒ ()
    revise: ƒ (newYear)
    constructor: ƒ Book(title, author, year)
    __proto__:
      constructor: ƒ Object()
      hasOwnProperty: ƒ hasOwnProperty()
      isPrototypeOf: ƒ isPrototypeOf()
      ...
```

## 4_inheritance

An object can inherit behaviour from another object through prototypal linkage. In this example, a **Magazine** object becomes  an extended version of a **Book** object. All methods from the base object are also accessible from the inheriting object and both object use a shared **this** value.

```js
function Book(title, author, year) {
  this.title = title;
  this.author = author;
  this.year = year;
}

Book.prototype.getSummary = function() {
  //...
};

Book.prototype.getAge = function() {
  //...
};

function Magazine(title, author, year, month) {
  Book.call(this, title, author, year);
  this.month = month;
}

Magazine.prototype = Object.create(Book.prototype);
Magazine.prototype.constructor = Magazine;

Magazine.prototype.updateMonth = function(month) {
  //...
};

const mag1 = new Magazine('Mag One', 'John Doe', 2018, 'Jan');
```


Firstly, remember that when a function is called with `new`, its `this` value is initialized with an empty object (prototype linked to `Object.prototype`).

In order to initialize the base object (in this example **Book**), its constructor function must be called, with the `this` value set to that of the calling constructor (here, **Magazine**).

This is done with the [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) method (see Figure 4 below), passing the `this` value of the calling constructor as its first argument. If the called constructor expects arguments they are passed as additional arguments following the `this` value. In this example, the called constructor for **Book** expects the arguments `title`, `author` and `year`.

```js
function Magazine(title, author, year, month) {
  Book.call(this, title, author, year);
  //...
}
```

Next, the prototype of the calling constructor must be linked to the called constructor. This is done with the help of [Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).

```js
Magazine.prototype = Object.create(Book.prototype);
```

Finally, we must update the `.constructor` property of the prototype to point to the correct constructor function.

```js
Magazine.prototype.constructor = Magazine;
```

With all this, the prototypal linkage is complete, as shown in Figure 3 below.

![4_inheritance](./assets/4_inheritance.png)
Figure 3. Prototype chain from explicit prototypal inheritance.

From [MDN instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof): _The **instanceof operator** tests whether the prototype property of a constructor appears anywhere in the prototype chain of an object._

```js
console.log(mag1 instanceof Magazine);  // true
console.log(mag1 instanceof Book);      // true
console.log(mag1 instanceof Object);    // true
```

Output from `console.log(mag1)`:

```
Magazine {title: "Mag One", author: "Jon Doe", year: 2018, month: "Jan"}
  author: "John Doe"
  month: "Jan"
  title: "Mag One"
  year: 2018
  __proto__: Book
    constructor: ƒ Magazine(title, author, year, month)
    updateMonth: ƒ (month)
    __proto__:
      getAge: ƒ ()
      getSummary: ƒ ()
      constructor: ƒ Book(title, author, year)
      __proto__:
        constructor: ƒ Object()
        hasOwnProperty: ƒ hasOwnProperty()
        isPrototypeOf: ƒ isPrototypeOf()
        ...
```

![function_proto](./assets/function_proto.png)
Figure 4. Every JavaScript function is prototype-linked to `Function.prototype`, which in its turn if is linked to `Object.prototype`. A function can have properties and methods, just like any object.

```js
console.log(typeof Book === 'function'); // true
console.log(Book instanceof Function); // true
console.log(Book instanceof Object); // true
console.log(Book.__proto__ === Function.prototype); // true
console.log(typeof Function === 'function'); // true
```

## 5_object_create

The method of implementing prototypal inheritance demonstrated in this example is uncommon in practice and will not be further discussed here.

## 6_classes.js

The pre-ES6 method of implementing explicit prototypal linkage is rather cumbersome as you may have concluded already. Fortunately, ES6 classes make implementing inheritance far simpler as shown in the code snippets below. They still use prototypal linkage behind the scenes, but using a more elegant syntax, familiar from other object-oriented languages such as Java, C++ and C#. This more palatable class syntax in ES6 JavaScript is sometimes referred to as _syntactic sugar_.

```js
class Book {
  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  getSummary() {
    //...
  }

  getAge() {
    //...
  }

  revise(newYear) {
    //...
  }
}

const book1 = new Book('Book One', 'John Doe', 2013);
const book2 = new Book('Book Two', 'Jane Doe', 2016);
```

Similar to the non-ES6 case, all object instances created from the same class share a single copy of its underlying prototype object:

```js
book1.__proto__ === Book.prototype // true
book2.__proto__ === Book.prototype // true
```

![6_classes](./assets/6_classes.png)
Figure 5. ES6 classes: identical to Figure 1, except that the Book constructor is now a `class`.

Output from `console.log(book1)`:

```
Book {title: "Book One", author: "John Doe", year: 2013}
  author: "John Doe"
  title: "Book One"
  year: 2013
  __proto__:
    constructor: class Book
    getAge: ƒ getAge()
    getSummary: ƒ getSummary()
    revise: ƒ revise(newYear)
    __proto__:
      constructor: ƒ Object()
      hasOwnProperty: ƒ hasOwnProperty()
      isPrototypeOf: ƒ isPrototypeOf()
      ...
```


## 7_subclasses

Inheriting from a base class is easy using ES6 class syntax. A class can inherit from another class by means of the `extends` keyword. This automatically sets up the required prototypal linkage, as shown in Figure 6 below.

```js
class Book {
  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  getSummary() {
    //...
  }
}

class Magazine extends Book {
  constructor(title, author, year, month) {
    super(title, author, year);
    this.month = month;
  }

  updateMonth(month) {
   //...
  }
}

const mag1 = new Magazine('Mag One', 'John Doe', 2018, 'Jan');
```

In OOP parlance, the class that inherits from the base class (in this example, **Magazine**) is called a **subclass** of the class it extends. The base class itself (here, **Book**) is called the **superclass**.

![7_subclasses](./assets/7_subclasses.png)
Figure 6. ES6 class-based inheritance: `extends`.

```js
console.log(mag1 instanceof Magazine);  // true
console.log(mag1 instanceof Book);      // true
console.log(mag1 instanceof Object);    // true
```

Output from `console.log(mag1)`:

```
Magazine {title: "Mag One", author: "Jon Doe", year: 2018, month: "Jan"}
  author: "Jon Doe"
  month: "Jan"
  title: "Mag One"
  year: 2018
  __proto__: Book
    constructor: class Magazine
    updateMonth: ƒ updateMonth(month)
    __proto__:
      constructor: class Book
      getSummary: ƒ getSummary()
      __proto__:
        constructor: ƒ Object()
        hasOwnProperty: ƒ hasOwnProperty()
        isPrototypeOf: ƒ isPrototypeOf()
        ...
```
