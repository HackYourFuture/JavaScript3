// Book Constructor
function Book(title, author, year) {
  this.title = title;
  this.author = author;
  this.year = year;
}

Book.prototype.getSummary = function() {
  return `${this.title} was written by ${this.author} in ${this.year}.`;
};

Book.prototype.getAge = function() {
  const years = new Date().getFullYear() - this.year;
  return `${this.title} is ${years} years old.`;
};

// Magazine Constructor
function Magazine(title, author, year, month) {
  Book.call(this, title, author, year);
  this.month = month;
}

// Inherit Prototype
Magazine.prototype = Object.create(Book.prototype);

// Use Magazine Constructor
Magazine.prototype.constructor = Magazine;

Magazine.prototype.updateMonth = function(month) {
  this.month = month;
};

// Instantiate Magazine Object
const mag1 = new Magazine('Mag One', 'John Doe', 2018, 'Jan');

console.log(mag1);
console.log(mag1.getSummary());
