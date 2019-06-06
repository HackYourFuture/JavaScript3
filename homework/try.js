'use strict';

class View {
  constructor(e) {
    this.initialize(e);
  }
  
  async initialize(e) {
    const t = document.getElementById('root');
      const r = Util.createAndAppend('header', t, { class: 'header' });
    Util.createAndAppend('p', r, { html: 'HYF Repositories' });
    const n = Util.createAndAppend('select', r, {
      class: 'repo-selector',
      'aria-label': 'HYF Repositories',
    });
    n.addEventListener('change', () => this.fetchAndRender(n.value)),
      Util.createAndAppend('div', t, { id: 'container' });
    try {
      const t = await Util.fetchJSON(e);
      (this.repos = t.sort((e, t) => e.name.localeCompare(t.name)).map(e => new Repository(e))),
        this.repos.forEach((e, t) => {
          Util.createAndAppend('option', n, { html: e.name(), value: t });
        }),
        this.fetchAndRender(n.value);
    } catch (e) {
      this.renderError(e);
    }
  }
  async fetchAndRender(e) {
    const t = this.repos[e],
      r = document.getElementById('container');
    try {
      const e = await t.fetchContributors();
      r.innerHTML = '';
      const n = Util.createAndAppend('div', r, { class: 'left-div whiteframe' }),
        i = Util.createAndAppend('div', r, { class: 'right-div whiteframe' });
      Util.createAndAppend('p', i, { html: 'Contributions', class: 'contributor-header' });
      const a = Util.createAndAppend('ul', i, { class: 'contributor-list' });
      t.render(n), e.map(e => new Contributor(e)).forEach(e => e.render(a));
    } catch (e) {
      this.renderError(e);
    }
  }
  renderError(e) {
    const t = document.getElementById('container');
    (t.innerHTML = ''),
      Util.createAndAppend('div', t, { html: e.message, class: 'alert alert-error' });
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new View(HYF_REPOS_URL);
