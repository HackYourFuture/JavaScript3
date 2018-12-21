'use strict';

// class Dog {
//   constructor(name, color, numLegs = 4) {
//     this.name = name;
//     this.color = color;
//     this.numLegs = numLegs;
//   }
// }
// const myDog = new Dog('Tarzan', 'brown');
// console.log(myDog);


class Pet {
  constructor(name, color, numLegs, sound) {
    this.name = name;
    this.color = color;
    this.numLegs = numLegs;
    this.sound = sound;
  }
  saySomething() {
    console.log('Saying: ' + this.sound); //Method
  }
}


class Dog extends Pet {
  constructor(name, color) {
    super(name, color, 4, 'wuf');
  }
}
class Bird extends Pet {
  constructor(name, color) {
    super(name, color, 2, 'chirp')
  }

}
const myDog = new Dog('Tarzan', 'brown');
console.log(myDog);
myDog.saySomething()

const myBird = new Bird('Owl', 'White', 2)
console.log(myBird);
myBird.saySomething();