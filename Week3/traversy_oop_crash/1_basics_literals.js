// Object Literal
const book1 = {
  title: 'Book One',
  author: 'John Doe',
  year: 2013,
  getSummary: function() {
    return `${this.title} was written by ${this.author} in ${this.year}.`;
  },
};

const book2 = {
  title: 'Book Two',
  author: 'Jane Doe',
  year: 2016,
  getSummary: function() {
    return `${this.title} was written by ${this.author} in ${this.year}.`;
  },
};

console.log(book1.getSummary());
console.log(book2.getSummary());
