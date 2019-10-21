# Homework JavaScript3 Week 2

## **Todo list**

1. Practice the concepts
2. JavaScript exercises
3. Code along
4. PROJECT: Hack Your Repo II

## **1. Practice the concepts**

Let's start this week off with some interactive exercises! Visit the following link to get started:

- [Learn JavaScript: Promises](https://www.codecademy.com/learn/introduction-to-javascript/modules/javascript-promises)

## **2. JavaScript exercises**

**_No exercises this week_**

## **3. Code along**

In the following "code along" you'll be building a complete Weather App that makes use of the [Darksky API](https://darksky.net).

Enjoy!

- [Build a Weather App with Vanilla JavaScript Tutorial](https://www.youtube.com/watch?v=wPElVpR1rwA)

## **4. PROJECT: Hack Your Repo II**

> The homework for week 2 will build on the work you did in week 1. You will create a new branch based on the the previous week's branch.

The assignment this week is to enhance your application to look similar to the following:

![UI Example](./assets/week2.png)

Instead of displaying details for _all_ repositories, this version should show information for a single repository and also list its contributors. The actual repository for which details are to be displayed should be selectable with a select box.

The `index.html` file should include the following components:

1. An HTML `select` element from which the user can select a HYF repository. This `select` element must be populated with `option` elements, one for each HYF repository.
2. A left-hand column that displays basic information about the selected repository.
3. A right-hand column that displays a list of contributors to the repository.

A suggested HTML structure could be:

```html
<body>
  <div id="root">
    <header class="...">...</header>
    <main class="main-container">
      <section class="repo-container">...</section>
      <section class="contributors-container">...</section>
    </main>
  </div>
</body>
```

### Requirements

The enhanced application should fulfill the following requirements:

1. The list of repositories in the `select` element should be sorted (case-insensitive) on repository name.
2. At start-up your application should display information about the first repository as displayed in the `select` element.
3. When the user changes the selection, the information in the web page should be refreshed for the newly selected repository.
4. You should be able to click on the repository name of the selected repository to open a new browser tab with the GitHub page for that repository.
5. You should be able to click on a contributor to open a new browser tab with the GitHub page for that contributor.
6. Your UI should be responsive. Try it with Chrome Developer Tools in the browser, using a mobile phone format and a tablet format, portrait and landscape.
7. The `XMLHttpRequest` in the `fetchJSON` function should be replaced with `fetch`. Hint: Because `fetch` returns a promise out of the box there is no need create a promise yourself with `new Promise(...)`.

**Hints:**

- Add one `option` element per repository to the `select` element, where each `option` element has the array index of the repository as its `value` attribute and the name of the repository as its text content:

  ```html
  <select>
    <option value="0">alumni</option>
    <option value="1">angular</option>
    <!-- etc -->
  </select>
  ```

- To sort the list repositories use [`.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) and [`.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).

Good luck!

## **SUBMIT YOUR HOMEWORK!**

After you've finished your todo list it's time to show us what you got! The homework that needs to be submitted is the following:

1. PROJECT: HackYourRepo II

Upload both to your forked JavaScript3 repository in GitHub. Make a pull request to the original repository.

> Forgotten how to upload your homework? Go through the [guide](../hand-in-homework-guide.md) to learn how to do this again.

_Deadline Saturday 23.59 CET_
