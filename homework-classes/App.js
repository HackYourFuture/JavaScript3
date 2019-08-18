'use strict';

{
  const accounts = {
    hyf: {
      name: 'HackYourFuture',
      type: 'org',
    },
    microsoft: {
      name: 'Microsoft',
      type: 'org',
    },
    jim: {
      name: 'remarcmij',
      type: 'user',
    },
  };

  const { Model, View } = window;

  class App {
    constructor(account) {
      const model = new Model(account);
      this.pageView = new View(model, account);
    }
  }

  window.onload = () => new App(accounts.hyf);
}
