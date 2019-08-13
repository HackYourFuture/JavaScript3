'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  createRepositoryWidget(container, options = {}) {
    const widgetContainer = Util.createAndAppend('div', container, {
      class:
        'd-flex flex-column  alert alert-primary justify-content-start align-items-center flex-sm-column flex-lg-row',
    });
    Util.createAndAppend('i', widgetContainer, {
      class: `widget-icon ${options.faClasses} fa-3x px-3 py-1`,
    });
    Util.createAndAppend('h4', widgetContainer, {
      text: `${options.title}:`,
      class: 'py-2 px-2 widget-title',
    });
    Util.createAndAppend(options.valueTag || 'h4', widgetContainer, {
      text: options.value,
      class: 'widget-value lead',
    });
    return widgetContainer;
  }

  render(mainParent) {
    const leftColumn = Util.createAndAppend('div', mainParent, {
      class: 'd-flex flex-column repo-detail',
      id: 'repo-detail',
    });

    const widgetContainer = this.createRepositoryWidget(leftColumn, {
      faClasses: 'fab fa-github',
      title: 'Repository Name:',
      value: this.repository.name,
      valueTag: 'a',
    });

    const anchorTag = widgetContainer.lastChild;
    anchorTag.setAttribute('href', this.repository.html_url);
    anchorTag.setAttribute('target', '_blank');

    this.createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-pen-alt',
      title: 'Description',
      value: this.repository.description,
    });

    const createdDate = new Date(this.repository.created_at).toDateString();
    this.createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-calendar-plus',
      title: 'Created',
      value: createdDate,
    });

    const updatedDate = new Date(this.repository.updated_at).toDateString();
    this.createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-clock',
      title: 'Updated',
      value: updatedDate,
    });

    this.createRepositoryWidget(leftColumn, {
      faClasses: 'fas fa-code-branch',
      title: 'Forks',
      value: this.repository.forks,
    });
  }

  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
