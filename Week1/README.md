# Reading Material JavaScript3 Week 1

## Agenda

These are the topics for week 1:

1. Application Programming Interface (API)
   - Public/private APIs
   - Connecting with APIs
2. Asynchronous JavaScript and XML (AJAX)
   - JavaScript Object Notation (JSON)?
   - XMLHttpRequest (XHR)
3. Modules & Libraries
   - What's a module?
   - What's a library?
   - An example of a library
   - How to use a library

## 1. Application Programming Interface (API)

Whenever we talk development we'll inevitably end up talking about Application Programming Interfaces, or APIs for short. But what is all the fuss about?

The first thing we need to understand is that API means different things to different people. Some people use it to refer to a complete application (frontend + backend), others use it to only refer to the server, or there's even people who use it to refer to any part of an application (i.e. "frontend API"/"server API")

For our purposes it's useful to stick to one definition, while keeping in mind that others will use it differently. Here's the definition we'll use:

```markdown
An API is any software that contains a part that's accessible from an outside source: i.e. open to requests from the client (whether it's a from a frontend or another server). That part that's accessible is the "interface" of that software.
```

You can think of an API in the following manner: Imagine you want to rent out a room in your house through Airbnb. Everyone who has a key to this room can freely enter and make use of whatever is inside. In this analogy the house is the API, while the room that's rented out is the "interface".

For more research, check out the following resources:

- [What are APIs - series](https://www.youtube.com/watch?v=cpRcK4GS068&list=PLcgRuP1JhcBP8Kh0MC53GH_pxqfOhTVLa)

### Public/private APIs

There are 2 different types of APIs: **public** and **private** APIs.

An API is **public** when software companies publish parts of their software to be freely used by developers from the outside world. If you were to integrate the Facebook API as a login sytem in your application, you would be using their API as a public API.

Conversely, there are also **private** APIs: software companies that grant access to parts of their backend applications to internal developers only, in order to develop new services to be used either internally or for the outside world.

In reality, there are way more private than public APIs. This is because it's usually in the company's best interest to keep their code base hidden from the public eye: it would be like giving your secret recipe away for nothing.

Keep this in mind: **in the real world programming is a means to serving a business end**. In this course you're learning how to program, to make nice-looking functional applications. However, this is always done within a business context. This is to say: does this software lead to making more money/gaining more popularity/or the achievement of any other business goal?

- [The Business Impact of Private, Partner and Public APIs](https://www.youtube.com/watch?v=Bk50AYGvs-g)

### Connecting with APIs

A big part of what applications do is **moving data from one place to another**. Let's say you are on the HackYourFuture website and feel like donating some money. First of all, that's very nice of you! You head out to the website and click on the donate button. You type in the amount and click on "donate". You'll notice you immediately get redirected to a different website, namely Mollie.com. How did Mollie know how to do this?

It's because the HackYourFuture website sends an **API call** to Mollie. The request basically says "Hey Mollie, some user from the HackYourFuture site wants to make a digital payment, can you handle that?". As a response Mollie answers "Of course, send the user to this specific URL and I'll take it from there!".

> Anytime a request to an API is made this is called an `API call`. However, in practice people use different terms for the same thing. Synonyms for `API call` are `API request`, `Network call/request` or`HTTP call/request`. Which do you prefer?

For further study of how to make API calls, check out the following resources:

- [Working with APIs in JavaScript](https://www.youtube.com/watch?v=ecT42O6I_WI)
- [Making HTTP Requests in JavaScript](https://www.kirupa.com/html5/making_http_requests_js.htm)

## 2. Asynchronous JavaScript and XML (AJAX)

AJAX is the idea that data can be loaded into a webpage without refreshing the entire website. The term is an acronym for `asynchronous JavaScript and XML`. Let's pick that apart:

- Asynchronous JavaScript refers to the fact that an asynchronous function is used. As we've learned in the previous module, an asynchronous function allows the browser to do multiple things simultaneously.
- XML is a data format used to send information from a server to a client, and vice versa.

The name AJAX is actually a misnomer, because XML isn't really used any more. Instead, another data format has taken its place: `JSON`.

### JSON

In AJAX we make a client request to a web server, that in response sends us back information to be used in the frontend. Generally speaking, this data will be send in `JSON` format.

So, technically speaking, the term would actually be AJAJ. However, the industry has decided to stick with the term AJAX to refer to these processes.

- [JSON Crash Course](https://www.youtube.com/watch?v=wI1CWzNtE-M)

### XMLHttpRequests (XHR)

In order to make an AJAX request we have to make use of a special type of object, called `XMLHttpRequest`(shortened to XHR). It's an object predefined for us by the `window` object in the browser.

> The `window` object is the most top-level object available to us in the browser. It contains the `document`, which contains all the HTML/CSS and JavaScript we write. Besides this, the `window` also contains a lot of other things we use when writing frontend code: `setTimeout()`, `alert()` and it even contains a reference to the `console` (from which we get `console.log()`). Try it out in the console if you want to see for yourself!

By creating a new instance of this object we can start making AJAX requests!

```js
const xhr = new XMLHttpRequest();
```

Making XHR requests is the primary way of making API calls. It allows us to send and retrieve data from other services.

Check the following resources to learn more about XHR.

- [XMLHttpRequest](https://github.com/hackyourfuture/fundamentals/blob/master/fundamentals/XMLHttpRequest.md)
- [AJAX Crash Course](https://www.youtube.com/watch?v=82hnvUYY6QA)
- [Sending JavaScript Http Requests with XMLHttRequest](https://www.youtube.com/watch?v=4K33w-0-p2c)

## 3. Modules & Libraries

### What's a module?

A `module` is a part of a program that contains one or more functionalities. For example, a single function that has only 1 job could be considered a module. When developing applications you'll always be writing multiple functionalities in order for your software to work as expected. These can be written all in one file, and it would fine. The browser/operating system would be able to interpret and execute it anyway. But for you, the human, it's very hard to keep overview of what is happening at what level of the application.

In order to keep a better overview, we can choose to **modularize** our application: split it up into smaller parts that, in theory, all work independently.

However, creating better overview is not the only reason. Among other reasons, modules make a developer's job easy by:

- Allowing them to focus on only one area of the functionality of the software application
- Isolating individual blocks of code, in case anything breaks
- Encouraging the developer to write code in a way that makes it reusable

For more information about this, go through the following:

- [JavaScript Modules: From IIFEs to CommonJS to ES6 Modules](https://www.youtube.com/watch?v=qJWALEoGge4)

### What's a library?

If you've ever written code you know how easy it is to duplicate it: you just copy and paste it.

Modules are small blocks of code that make up a functionality. But what if you have a bunch of modules that collectively aim to solve a bigger problem, like creating a [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application)?

For this we use a `library`: a set of code that a developer (or a team of developers) has written in order to solve these bigger problems within an application. A library, typically, contains a collection of modules that work together to solve a big problem.

> Like many things in programming, people use various terms to describe the same thing. In the case of `library`, you'll often hear it spoken of as `package` or `namespace`.

Why do we use libraries? We use them to help us make building applications easier. Think of it like building a house: in theory you could do it all by hand. But as you can imagine, this is highly inefficient and time-consuming. So instead we use tools to help us out. These can be small tools (like a hammer or screwdriver) or bigger ones (like a concrete mixer or wheel barrow).

In the real-world companies use libraries all the time. They either make them themselves, or they make use of public ones. If the original developers of a library have published their code, through a platform like [npmjs.com](https://www.npmjs.com/) for example, it can legally be used in custom applications. This is called **open-source**: the source code is open for any to look into, use and modify to their own needs.

Examples of common JavaScript libraries are the following:

- [jQuery](https://jquery.com/)
- [D3](https://d3js.org/)
- [React.js](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [Lodash](https://lodash.com/)

When researching these it's important to ask yourself two questions:

- What problem does the library solve?
- How does it fit in the architecture of the software I am trying to make?

For further study, check the following:

- [JavaScript Libraries](https://www.youtube.com/watch?v=uq7omoxwA7A)

### An example of a library

In a previous section we discussed APIs and the importance of being able to make API calls. We have seen that we can use the XHR object to do so. In this section we'll discuss a `library` that makes this process easier for us. It's called [axios](https://github.com/axios/axios), a JavaScript library that allows us to make API calls in an easier way.

Here's what it looks like in action:

```js
const axios = require('axios'); // We have to load in the library first

// Make a GET request to get user data from the Pokemon API
axios
  .get('https://pokeapi.co/api/v2/pokemon')
  .then(function(response) {
    console.log(response);
    // Do something with data
  })
  .catch(function(error) {
    console.log(error);
    // Do something with error
  });
```

Any library that exists is developed to solve some problem. The main problems `axios` aims to solve are the following:

1. how to much easier make an `HTTP request`
2. how to write more readable asynchronous code.

Here's how `axios` solves problem 1:

- It abstracts away/"simplifies")the XHR logic needed to make an API call and wraps it inside of functions that are more descriptive (like `axios.get` or `axios.post`, to indicate a GET and POST request)

Here's how `axios` solves problem 2:

-

### How to use a library

Now that you've learned about the utility of libraries, let's talk a little about how to approach using a library. The first question we must ask is: when is it appropriate to use a library?

The second question is: how to start using a new library?

## Finished?

Are you finished with going through the materials? High five! If you feel ready to get practical, click [here](./MAKEME.md).
