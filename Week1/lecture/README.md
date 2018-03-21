# JavaScript 3 - Week 1

## Preparations

- Ensure that Node 8+ LTS is installed
- Ensure that ESLint is installed globally
- Check VSCode settings on students machines, formatOnXXX, snippetSuggestions
- Check VSCode extensions: Code Spell Checker, ESLint and View in Browser
- Create a hyf-javascript3 repo on GitHub with .gitignore and README
- Add a .eslintrc file
- Create week1, week2 and week3 folders
- Create handson1 folder

## Lecture

### Content

We are building a Single Page Application that uses the [Nobel Prize API](https://nobelprize.readme.io/).

New concepts covered during this lecture:

- Creating a Single Page Application (SPA).
- Calling a remote [API](https://medium.freecodecamp.org/what-is-an-api-in-english-please-b880a3214a82) with [XMLHttpRequest](https://github.com/HackYourFuture/fundamentals/blob/master/fundamentals/XMLHttpRequest.md).
- Using asynchronous callbacks in conjunction with XMLHttpRequest.
- Applying the DRY principle ([Don't Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) by creating utility functions that take care of much of the boring, repetitive work.

Use the `live-coding` folder for all live coding.

### 99-final

- Show the final version as target for the end of the lecture.

### 1-callback

- Revisit (async) callbacks.

### 10-xhr-base

- Explain what an API is.
- [Todd Motto's Public APIs](https://github.com/toddmotto/public-apis)
- Install JSON View Chrome extension
- [Awesome JSON Datasets](https://github.com/jdorfman/awesome-json-datasets)
- Play with [Nobel Prize API](https://nobelprize.readme.io/)
- Find documentation for XMLHttpRequest - Google: `mdn xmlhttprequest`
- Explain that XMLHttpRequest is provided by the browser, not by JavaScript. It is not available in Node.
- Demonstrate base version of XMLHttpRequest.
- Open the Chrome Developer Tools and examine the console and the network tab.
- Add a console.log to show the `readyState`.
- Change the queryString to an unsupported value and demonstrate the error case.

### 11-xhr-callback

- Refactor code to create a reusable `fetchJSON` function taking a `url` and a callback as given in folder `11-xhr-callback`.

### 12-xhr-render

- Render the data as a `pre` tag showing the JSON data

### 13-xhr-html

- Show an example of the HTML we want to create dynamically from the JSON data

### 14-xhr-first

- First version of rudimentary HTML

### 15-xhr-dry

- Create a `createAndAppend` function: DRY.
- Explain that functions allow us to abstract away details so we can concentrate on the task at hand.
- Explain the benefits of reusability.

### 16-xhr-dryer

- Demonstrate improved version of `createAndAppend`.

### 99-final

This folder contains the finished version of the Nobel Prize SPA:

- It adds styling through an external stylesheet (`style.css`), that is loaded via the `index.html` file.
- It adds a `<select>` element that contains collection of queries that can be made against the Nobel Prize API.
- It adds an event handler to the `change` event of the `<select>` element, so that a new XMLHttpRequest is made whenever the selection changes.
- It extends the `createAndAppend` function with an ability to specify the `innerHTML` and any HTML attributes to the newly created element in a single call to `createAndAppend`. This is done via an optional third parameter, named `options`.

#### createAndAppend

The extended version of `createAndAppend` is shown below. The added third parameter `options` is optional. If you supply this parameter when calling `createAndAppend` it must be an object with HTML attribute names and values. If you don't supply it, the value of the `options` parameter is set to an empty object. This is what the (ES6) syntax `options = {}` does. So, what follows the `=` sign is _default_ value for `options`, i.e. assigned to the parameter if it is not provided when `createAnAppend` is called.

As you can see, the `forEach` method iterates through all keys of the `options` object. If the name of a property key is `html` it assigns the property value to the `innerHTML` of the newly created HTML element. Otherwise the **property key** is assumed to be the name of an HTML attribute and the **property value** the value of that attribute. The `.setAttribute` method is then called using `key` and `value` as its parameters.


```js
function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'html') {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}
```

Here is an example of how the `createAndAppend` function can be called:

```js
createAndAppend('td', tr, { html: 'Name:', class: 'label' });
```

This call:

1. creates a `<td>` element,
2. appends it to its parent `tr` element,
3. sets its innerHTML to `'Name:'`,
4. and set its `class` attribute to `'label'`.

#### addRow

This is a small utility function that just adds a new row (`tr`) to a `tbody`. This is again an example of DRY: remove some of the repetition that we would otherwise have to make in our code: `less work === more fun` and `less work === fewer errors`!


```js
function addRow(tbody, label, value) {
  const row = createAndAppend('tr', tbody);
  createAndAppend('td', row, { html: label + ':', class: 'label' });
  createAndAppend('td', row, { html: value });
}
```