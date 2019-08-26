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

  const { Model, HeaderView, RepoView, ContributorsView, ErrorView } = window;
  const { createAndAppend } = window.Util;

  class App {
    constructor(account) {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { class: 'header' });
      this.mainContainer = createAndAppend('main', root, {
        id: 'main-container',
      });

      const model = new Model(account);
      model.subscribe(this);
      model.subscribe(new HeaderView(model, account, header));
      model.subscribe(new RepoView(this.mainContainer));
      model.subscribe(new ContributorsView(this.mainContainer));
      model.subscribe(new ErrorView(this.mainContainer));
      model.fetchData();
    }

    update() {
      this.mainContainer.innerHTML = '';
    }
  }

  window.onload = () => new App(accounts.hyf);
}
