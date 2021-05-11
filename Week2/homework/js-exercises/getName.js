const getAnonName = (firstName, newPromise) => {
  setTimeout(() => {
    if (!firstName)
      return Promise(new Error("You didn't pass in a first name!"));

    const fullName = `${firstName} Doe`;

    return newPromise(fullName);
  }, 2000);
};

getAnonName('John', console.log);
