'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  assignLeftPanelValues() {
    const getFirstID = document.getElementById('property_repository');
    getFirstID.innerText = this.repository.name;
    getFirstID.setAttribute('href', this.repository.html_url);
    getFirstID.setAttribute('target', '_blank');
    document.getElementById('property_description').innerText = this.repository.description;
    document.getElementById('property_forks').innerText = this.repository.forks;
    document.getElementById('property_updated').innerText = new Date(this.repository.updated_at);
  }

  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  name() {
    return this.repository.name;
  }
}
