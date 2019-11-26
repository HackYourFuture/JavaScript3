# Lesson Plan JavaScript3 Week 1

## Agenda

The purpose of this class is to introduce to the student:

- What are `APIs` and how to interact with them
- What is `AJAX` and how to apply it (`XMLHttpRequest`)
- How to use libraries (`axios`)

## Core concepts

FIRST HALF (12.00 - 13.30)

1. What are APIs and how to interact with them

Notes:

- APIs are created by providers and used by consumers (BE provider, FE consumer)
- Give real life example like (Devices like TV, any machine + electricity power socket interface which provides power to any external device)
- Communication between software and user needs UI interface but software and software needs API as an interface.
- Part of an application that can be communicated with from an outside source
- Connect to it using "endpoints"
- Mostly used to request data from some service
- Software well-known APIs (Fb APIs, Twitter APIs, Maps APIs, weather APIs);
- API doesn't care which language or technology is used in the consumer or the provider

### Types of APIs:-
- Private: for employees only under a company network for internal use.
- Semi-private: for clients who paid for the API.
- Public: for everyone on the web.

### Architecture styles of API:
- Single purpose: API that gives a direct and specific service.
- Aggregated API: one API as a wrapper for multiple APIs.
- Web services API: punch of APIs working together to forma whole app.

### Basic structure of REST API

- Endpoint: https://api.example.com
- Endpoint with version: https://api.example.com/v1
- Resources:
* https://api.example.com/v1/users
* https://api.example.com/v1/users/create
* https://api.example.com/v1/users/1
* https://api.example.com/v1/users/1/edit
- Query params:
* https://api.example.com/v1/users?limit=10


**Show examples**
Use [open weather app](https://openweathermap.org/api)
- Create an account or use the public key used in the examples.
- Use the endpoint for forecast and make a request via js file [Get current city weather by city name](https://openweathermap.org/current#name)
- Let them do the same using another endpoint [Get hourly forcasting by city name](https://openweathermap.org/api/hourly-forecast#name5)


2. What is `AJAX` and how to apply it (`XMLHttpRequest`)

Notes:

- Before AJAX all page reload for all requests, via refreshing the url in the address bar with the new resource.
- It's a technique, not a technology
- `AJAX` stands for Asynchronous JavaScript and XML
- Nowadays we use `JSON` instead of `XML`
- Fetch data without reloading the page
- The XMLHttpRequest API is defined in the browser (window.XMLHttpRequest)

**Do exercise**


Steps of doing the following example:-
** Install the live server plugin in VS (go to plugins -> live server -> install)
1. Create self-invoked function to wrap your code
2. Create an object instance of `XMLHttpRequest`
3. Call the `open` function to fill it with the Request URL and the request Method
4. Call the `send` function to make the request
5. Add event listener with a callback for the sucess event `load`


Example using the XMLHttpRequest

```
const oReq = new XMLHttpRequest();
oReq.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${cityName}`);
oReq.send();
oReq.addEventListener('load', function (event) {
  const data = JSON.parse(this.response);
  if (data.cod >= 400) {
    // error
    console.log(data.message);
  } else {
    //success
    console.log(data.coord.lat);
  }
});

// or another way of getting data
oReq.load = function (event) {
  // use oReq.response or this.response
  const data = JSON.parse(this.response);
  if (data.cod >= 400) {
    // error
    console.log(data.message);
  } else {
    //success
    console.log(data.coord.lat);
  }
};

```


SECOND HALF (14.00 - 16.00)

3. How to use libraries (`axios`)

Notes:

- A library is a code solution a developer (or a team) has written to a common problem
- Usually open-source
- Helps to solve a problem within an application
- Read the documentation on how to use it

**Do Exercise**

Same example but using axios

```
axios
  .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}`)
  .then(function (response) {
    // handle success
    console.log(response.data);
  }).catch(function (error) {
    // handle error
    console.log(error);
  }).finally(function () {
    // always be executed
    console.log('I am always here')
  });
```

> Note: Give example at the end with binding/showing these data in a DOM element like a <div> or a list instead of only showing them on the console using console.log.