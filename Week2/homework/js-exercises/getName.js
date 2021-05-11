const getAnonName = (firstName, newPromise) => {
  setTimeout(() => {
    if (!firstName)
      return Promise(new Error("You didn't pass in a first name!"));

    const fullName = `${firstName} Doe`;

    return newPromise(fullName);
  }, 2000);
};

getAnonName('John', console.log);

const checkDoubleDigits = (number, newPromise) => {
  setTimeout(() => {
    if (number > 10) return 'The number is bigger than 10!';
    else if (number < 10) return 'Error! The number is smaller than 10...';
    else return '10';
  });
};
