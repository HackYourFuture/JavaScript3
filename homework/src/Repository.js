'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const table = Util.createAndAppend('table', parent);

    const repoTr = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', repoTr, { 'text': 'Repository :', 'class': 'label' });
    const repoName = Util.createAndAppend('td', repoTr, { 'id': 'repo-name' });
    const url = Util.createAndAppend('a', repoName, { 'target': '_blank', });

    const descriptionTr = Util.createAndAppend('tr', table);
    const descriptionName = Util.createAndAppend('td', descriptionTr, { 'text': 'Description :', 'class': 'label' });
    const descriptionDetails = Util.createAndAppend('td', descriptionTr);

    const forkTr = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', forkTr, { 'text': 'Forks :', 'class': 'label' });
    const forkNum = Util.createAndAppend('td', forkTr);

    const updateTr = Util.createAndAppend('tr', table);
    Util.createAndAppend('td', updateTr, { 'text': 'Updated :', 'class': 'label' });
    const updateNum = Util.createAndAppend('td', updateTr);

    url.innerText = this.data.name;
    url.setAttribute('href', this.data.html_url);
    if (this.data.description === null) {
      descriptionName.innerHTML = '';
      descriptionDetails.innerText = '';
    } else {
      descriptionName.innerText = "Description: ";
      descriptionDetails.innerText = this.data.description;
    }
    forkNum.innerText = this.data.forks;
    const updateRepo = new Date(this.data.updated_at);
    updateNum.innerText = updateRepo.toLocaleString("en-US");
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}
