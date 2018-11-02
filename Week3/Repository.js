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
    const link = this.data.html_url;
    const name = this.data.name;
    const description = this.data.description;
    const forks = this.data.forks;
    const newDate = new Date(this.data.updated_at);
    const leftDiv = Util.createAndAppend("div", parent, { id: "info" });
    const ul = Util.createAndAppend("ul", leftDiv, { id: "repository_info" });
    const li = Util.createAndAppend("li", ul, { text: "Name:   ", class: "repository_details" });
    Util.createAndAppend("a", li, { text: name, href: link, target: "_blank" });
    Util.createAndAppend("li", ul, { text: "Description: " + description, class: "repository_details" });
    Util.createAndAppend("li", ul, { text: "Forks: " + forks, class: "repository_details" });
    Util.createAndAppend("li", ul, { text: "Updated: " + newDate.toLocaleString('en-GB', { timeZone: 'UTC' }), class: "repository_details" });
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
