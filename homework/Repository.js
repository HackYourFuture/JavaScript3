'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  assignLeftPanelValues(dataIndex) {
    function setLink(linkID, srcArray) {
      document.getElementById(linkID).innerText = srcArray.name;
      document.getElementById(linkID).setAttribute('href', srcArray.html_url);
      document.getElementById(linkID).setAttribute('target', '_blank');
    }

    setLink('property_repository', dataIndex);
    document.getElementById('property_description').innerText = dataIndex.description;
    document.getElementById('property_forks').innerText = dataIndex.forks;
    document.getElementById('property_updated').innerText = new Date(dataIndex.updated_at);
  }

  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  name() {
    return this.repository.name;
  }
}
