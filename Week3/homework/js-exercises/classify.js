// # STORY

// Abdulkareem is a 35 year old man, that lives in Riyadh.He has a wife and 3 children.As a day job he's a construction worker, that makes houses. He likes to eat dates and smoke water pipe.

// Abdulkareem has a horse, named Adel.The horse is 15 years old and has the color brown.Usually the horse eats grass or helps transport materials for Abdulkareem.

// And they lived happily ever after!

class Person {
  constructor(name, age, kind, city, wife, children) {
    this.name = name;
    this.age = age;
    this.kind = kind;

    this.city = city;
    this.wife = wife;
    this.children = children;
  }

  get info() {
    return `${this.name} is a ${this.age} years old ${this.kind},`;
  }
  get doSo() {
    return `${this.info} lives in ${this.city}. He ${this.wife} and ${this.children} childeren ${this.name} is a construction worker, that makes houses he likes to eat dates and smoke water pipe.`;
  }
}

class Animal extends Person {
  constructor(name, age, kind, color) {
    super(name, age, kind);
    this.color = color;
  }
  get doSo() {
    return `${super.info} and has a color ${
      this.color
    }, Usually eats grass or helps transport materials for Abdulkareem.`;
  }
}

let abdulkareem = new Person(
  'Abdulkareem',
  35,
  'man',
  'Riyadh',
  'has a wife',
  3,
);

let adel = new Animal('Adel', 15, 'horse', 'brown');

console.log(
  `${abdulkareem.doSo}

${adel.doSo}

And they lived happily ever after!`,
);
