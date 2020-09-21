/* eslint-disable max-classes-per-file */
/* eslint-disable new-cap */
/* eslint-disable no-console */

'use strict';

/*
Exercise 2: Classify

In this exercise you'll read a little story. It's your job to turn the characters in it into classes and instantiate the class into the characters you read about!

# STORY
Abdulkareem is a 35 year old man, that lives in Riyadh. He has a wife and 3 children. As a day job he's a construction worker, that makes houses. He likes to eat dates and smoke water pipe.

Abdulkareem has a horse, named Adel. The horse is 15 years old and has the color brown. Usually the horse eats grass or helps transport materials for Abdulkareem.

And they lived happily ever after!
After reading this story, you have to:

Create a class for Adbulkareem and Adel
Instantiate those classes to create an Abdulkareem object and Adel object

*/

// create classes

class man {
  constructor(firstName, age, city, familyArr, job, interestsArr) {
    this.firstName = firstName;
    this.age = age;
    this.city = city;
    this.family = familyArr;
    this.job = job;
    this.interests = interestsArr;
  }
}

class horse {
  constructor(name, age, color, activities) {
    this.name = name;
    this.age = age;
    this.color = color;
    this.activities = activities;
  }
}

// instantiate the objects
const manAbdulkareem = new man(
  'Adbulkareem',
  35,
  'Riyadh',
  ['1 wife', '3 children'],
  'construction worker',
  ['eat dates', 'smoke water pipe'],
);

console.log(manAbdulkareem);

const horseAdel = new horse('Adel', 15, 'brown', [
  'eats grass',
  'transports construction materials for Abdulkareem',
]);

console.log(horseAdel);
