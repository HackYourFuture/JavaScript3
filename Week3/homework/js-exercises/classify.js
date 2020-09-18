// # STORY

// Abdulkareem is a 35 year old man, that lives in Riyadh.He has a wife and 3 children.As a day job he's a construction worker, that makes houses. He likes to eat dates and smoke water pipe.

// Abdulkareem has a horse, named Adel.The horse is 15 years old and has the color brown.Usually the horse eats grass or helps transport materials for Abdulkareem.

// And they lived happily ever after!

class Details {
  constructor(name, old, kind, city, wife, children, color) {
    this.name = name;
    this.old = old;
    this.kind = kind;
    if (kind === 'man') {
      this.city = city;
      this.wife = wife;
      this.children = children;
    } else {
      this.color = color;
    }
  }
  doSo() {
    if (this.kind === 'man') {
      return `${this.name} is a ${this.old} years old ${this.kind}, lives in ${this.city}. He ${this.wife} and ${this.children} childeren ${this.name} is a construction worker, that makes houses he likes to eat dates and smoke water pipe.`;
    } else {
      return `${this.name} is a ${this.old} old years ${this.kind} and has a color ${this.color} Usually eats grass or helps transport materials for Abdulkareem`;
    }
  }
}

let abdulkareem = new Details(
  'Abdulkareem',
  35,
  'man',
  'Riyadh',
  'has a wife',
  3,
);
// console.log(abdulkareem.doSo());

let adel = new Details('Adel', 15, 'horse', '', '', '', 'brown');

// console.log(adel.doSo());
