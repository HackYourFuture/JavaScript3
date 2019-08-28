// Constructor
function Book(title, author, year) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.getSummary = function() {
    return `${this.title} was written by ${this.author} in ${this.year}.`;
  };
}

// Instantiate an Object
const book1 = new Book('Book One', 'John Doe', 2013);
const book2 = new Book('Book Two', 'Jane Doe', 2016);

console.log(book1.getSummary());
console.log(book2.getSummary());

console.log(book1);

book1.turnPage();
