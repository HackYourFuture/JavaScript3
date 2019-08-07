# Reading Material JavaScript3 Week 1

## Agenda

These are the topics for week 1:

1. Application Programming Interface (API)
   - Public/private APIs
   - Connecting with APIs
2. Asynchronous JavaScript and XML (AJAX)
   - XMLHttpRequest (XHR)
   - What is JSON?
3. jQuery
   - What's a module/package?
   - What's a library?
   - Using jQuery to make AJAX requests

## 1. Application Programming Interface (API)

- [What are APIs - series](https://www.youtube.com/watch?v=cpRcK4GS068&list=PLcgRuP1JhcBP8Kh0MC53GH_pxqfOhTVLa)

### Public/private APIs

There are 2 different types of APIs: **public** and **private** APIs.

An API is **public** when software companies publish parts of their software to be freely used by developers from the outside world. If you were to integrate the Facebook API as a login sytem in your application, you would be using their API as a public API.

Conversely, there are also **private** APIs: software companies that grant access to parts of their backend applications to internal developers only, in order to develop new services to be used either internally or for the outside world.

In reality, there are way more private than public APIs. This is because it's usually in the company's best interest to keep their code base hidden from the public eye: it would be like giving your secret recipe away for nothing.

Understand this fundamental truth: programming is a means to serving a business end. In this course you're learning how to program, to make nice-looking functional applications. However, this is always done within a business context. This is to say: does this software lead to making more money?

- [The Business Impact of Private, Partner and Public APIs](https://www.youtube.com/watch?v=Bk50AYGvs-g)

### Connecting with APIs

A big part of what applications do is **moving data from one place to another**. Let's say you are on the HackYourFuture website and feel like donating some money. First of all, that's very nice of you! You head out to the website and click on the donate button. You type in the amount and click on "donate"! You'll notice you immediately get redirected to a different website, namely Mollie.com. How did Mollie know to do this?

It's because the HackYourFuture website sends an **API call** to Mollie. The request basically says "Hey Mollie, some user from the HackYourFuture site wants to make a digital payment, can you handle that?". As a response Mollie answers "Of course, send the user to this specific URL and I'll take it from there!".

> Anytime a request to an API is made this is called an `API call`. However, in practice people use different terms for the same thing. Synonyms for `API call` are `API request`, `Network call/request` or`HTTP call/request`. Which do you prefer?

- [Working with APIs in JavaScript](https://www.youtube.com/watch?v=ecT42O6I_WI)
- [Making HTTP Requests in JavaScript](https://www.kirupa.com/html5/making_http_requests_js.htm)

## 2. Asynchronous JavaScript and XML (AJAX)

### XMLHttpRequests (XHR)

- [XMLHttpRequest](../../../../fundamentals/blob/master/fundamentals/XMLHttpRequest.md)
- [AJAX Crash Course](https://www.youtube.com/watch?v=82hnvUYY6QA)

## 3. jQuery

### What's a module/package?

### What's a library?

### Using jQuery to make AJAX requests
