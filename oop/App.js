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
      const containers = App.renderContainers();

      const model = new Model(account);
      const fetchData = model.fetchData.bind(model);

      model.subscribe(new HeaderView(account, containers.header, fetchData));
      model.subscribe(new RepoView(containers.repo));
      model.subscribe(new ContributorsView(containers.contributors));
      model.subscribe(new ErrorView(containers.error));

      fetchData();
    }

    static renderContainers() {
      const root = document.getElementById('root');
      const header = createAndAppend('header', root, { class: 'header' });
      const error = createAndAppend('div', root);
      const main = createAndAppend('main', root, {
        class: 'main-container',
      });
      const repo = createAndAppend('section', main, {
        class: 'repo-container whiteframe',
      });
      const contributors = createAndAppend('section', main, {
        class: 'contributors-container whiteframe',
      });
      return { header, error, main, repo, contributors };
    }
  }

  const ACCOUNT_KEY = 'hyf';
  window.onload = () => new App(accounts[ACCOUNT_KEY]);
}
