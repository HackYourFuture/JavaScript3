'use strict';

//console.log('Global' + this);

function greet(greeting, closing) {

  console.log(greeting + ' ' + this.name + ' ' + closing + '' + 'says ' + this.name + ' ' + this.sound);
};

function Dog(name, color, numlegs = 4) {
  //console.log('Inside Dog ' + this)
  this.name = name;
  this.color = color;
  this.numlegs = numlegs;
  this.sound = 'wuf'
  this.great = greet;
}
const myDog = new Dog('Tarzan', 'Brown');
const anotherDog = new Dog('Lassie', 'white', 3);
console.log(myDog);

//great('hello', '!')
//call method
// first Solution

greet.call(myDog, 'hello', '!')

// Second Solution
greet.call({
  name: 'lucky',
  sound: 'wuh'
}, 'hello', '!')

// console.log(anotherDog);

// bind method
// const greetDog = myDog.great.bind(myDog);
// greetDog('Hello with bind ', '!');
// bind method second option
const greetDog = greet.bind(myDog); //great function
greetDog('Hello with bind ', '!');