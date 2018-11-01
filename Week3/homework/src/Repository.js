'use strict';

/* global Util, Contributor */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  async render(parent) {
    //
    // Replace this comment with your code
    //
    const index = document.getElementById('selectRepositories').selectedIndex;

    //Left part - Repository Description
    this.addExtraText(parent, "Repository: ", this.name(), this.data.html_url);
    this.addExtraText(parent, "Description: ", this.data.description);
    this.addExtraText(parent, "Forks: ", this.data.forks);
    this.addExtraText(parent, "Updated: ", this.data.updated_at);


  }

  addExtraText(parent, boldText, normalText, url) {
    const pRepository = Util.createAndAppend('p', parent, { text: "" });
    if (url) {
      const boldRepoLabelElem = Util.createAndAppend('b', pRepository, { text: boldText, id: 'idNameRepo' });
      const ancRepository = Util.createAndAppend('a', boldRepoLabelElem, { href: url, 'aria-labelledby': "idNameRepo" });
      ancRepository.appendChild(document.createTextNode(normalText));
    } else {
      Util.createAndAppend('b', pRepository, { text: boldText });
      pRepository.appendChild(document.createTextNode(normalText));
    }

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
