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
    //
    // Replace this comment with your code
    //
    // ..
    // create table of the contents
    const lTable = Util.createAndAppend('table', parent);
    // line one
    const tr1 = Util.createAndAppend('tr', lTable);
    Util.createAndAppend('td', tr1, {html: 'Repository :', class: 'lable'});
    const td1 = Util.createAndAppend('td', tr1);
    const nameLink = '<a href="' + this.data.html_url + '" target="_blank">' + this.name() + '</a>';
    Util.createAndAppend('p', td1, {html: nameLink });
    // line two
    const tr2 = Util.createAndAppend('tr', lTable);
    Util.createAndAppend('td', tr2, {html: 'Description :', class: 'lable'});
    const td2 = Util.createAndAppend('td', tr2);
    Util.createAndAppend('p', td2, {html: this.data.description});
    // line three
    const tr3 = Util.createAndAppend('tr', lTable);
    Util.createAndAppend('td', tr3, {html: 'Forks :', class: 'lable'});
    const td3 = Util.createAndAppend('td', tr3);
    Util.createAndAppend('p', td3, {html: this.data.forks});
    // line four
    const tr4 = Util.createAndAppend('tr', lTable);
    Util.createAndAppend('td', tr4, {html: 'Updated :', class: 'lable'});
    const td4 = Util.createAndAppend('td', tr4);
    const defaultElDate = this.data.updated_at;
    const defaultDate = new Date(defaultElDate);
    const endDate = defaultDate.toLocaleString();
    Util.createAndAppend('p', td4, {html: endDate});
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
