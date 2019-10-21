# Homework JavaScript3 Week 3

## **Todo list**

1. Practice the concepts
2. JavaScript exercises
3. Code along
4. PROJECT: Hack Your Repo III

## **1. Practice the concepts**

Let's continue exercising those programming muscles! Go through the following exercises:

- [Learn JavaScript: Objects](https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-objects)
- [Learn JavaScript: Classes](https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-classes)
- [Learn JavaScript: Async/Await](https://www.codecademy.com/learn/introduction-to-javascript/modules/asynch-js)

## **2. JavaScript exercises**

**_No exercises this week_**

## **3. Code along**

- [YouTube API Project with Authentication](https://www.youtube.com/watch?v=r-yxNNO1EI8)

## **4. PROJECT: Hack Your Repo III**

> The homework for week 3 will build on the work you did in week 2. You will create a new branch based on the the previous week's branch.

The final week's assignment consists of two parts.

In the first part you will update the homework from week 2 (in the `homework` folder). In the second part you will refactor your application to use `ES6 classes`. For this, you need to modify the files in the `homework-classes` folder.

### Step 1: `async/await`

- Refactor all `.then()` and `.catch()` methods with `async`/`await` and `try...catch`.
- Make sure that your error handling code still works. See the instructions from week 2's [homework](../Week2/MAKEME.md) on how to force an error response from GitHub.

### Step 2: OOP and ES6 classes

This final assignment requires you to go the extra mile and get acquainted with Object Oriented Programming and ES6 classes.

> The relevant files for this part of the homework can be found in the **homework-classes** folder.

| File                | Description                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| index.html          | The application's HTML file.                                                                           |
| style.css           | CSS styling.                                                                                           |
| hyf.png             | The HYF logo.                                                                                          |
| App.js              | The **App** class is the main container class for the app.                                             |
| Observable.js       | The **Observable** class is a base class implementing functionality of the Observer pattern.           |
| Model.js            | The **Model** class is concerned with all data handling (e.g. fetching). Extends the Observable class. |
| HeaderView.js       | The **HeaderView** class renders the header with the select element.                                   |
| RepoView.js         | The **RepoView** class renders the details for the selected repository.                                |
| ContributorsView.js | The **ContributorsView** class renders the contributors for the selected repository.                   |
| ErrorView.js        | The **ErrorView** class renders an error, if present.                                                  |
| Util.js             | The **Utility** class provides (static) utility functions.                                             |

1. Copy CSS styling from your non-OOP version of the homework into **style.css**.
2. Add and adapt code from your non-OOP version of the homework to **RepoView.js** and **ContributorsView.js**.
3. Do not change any other files at this point.

- Modify the **RepoView.js** and **ContributorsView.js** files, by adding and adapting code from your non-OOP version of the homework to these files. You should also copy the styling from your non-OOP version. Other files should not be modified.

The image below illustrates the interrelationship between the various classes in the application using a [UML Class Diagram](https://en.wikipedia.org/wiki/Class_diagram). This particular one was created with with **LucidChart** ([YouTube tutorial](https://youtu.be/UI6lqHOVHic), 10 mins).

![JavaScript3_classes](./assets/JavaScript3_classes.png)

You can conclude the following from this diagram:

1. The **Model** class **extends** (_inherits from_) the **Observable** class. Views (i.e., 'observers') can subscribe to the Model and get notified on data updates.

2. There are four View classes that implement the **IObservable** interface, i.e. they implement the required `update()` method:

   - **HeaderView**
   - **RepoView**
   - **ContributorsView**
   - **ErrorView**

3. The **SelectView** class calls the `fetchData()` method from the **Model** class to request a data fetch.

#### Step 3: `axios`

1. Modify the `fetchJSON` static method in **Model.js** to replace **fetch** with **axios**.
2. Add a `<script>` tag to **index.html** to load the **axios** library from a CDN (Content Delivery Network) site. Use Google to find the right URL.

## **SUBMIT YOUR HOMEWORK!**

After you've finished your todo list it's time to show us what you got! The homework that needs to be submitted is the following:

1. PROJECT: HackYourRepo III

Upload both to your forked JavaScript3 repository in GitHub. Make a pull request to the original repository.

> Forgotten how to upload your homework? Go through the [guide](../hand-in-homework-guide.md) to learn how to do this again.

_Deadline Saturday 23.59 CET_
