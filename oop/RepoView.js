'use strict';

{
    const { createAndAppend } = window.Util;

    class RepoView {
        constructor(container) {
            this.container = container;
        }

        update(state) {
            if (!state.error) {
                this.render(state.selectedRepo);
            }
        }

        /**
         * Renders the repository details.
         * @param {Object} repo A repository object.
         */
        render(repo) {
            this.container.innerHTML = '';

            createAndAppend('p', this.container, {
                text: "Repository : " + repo.name,
                class: 'repo-par',
            });
            createAndAppend('p', this.container, {
                text: "Description : " + repo.description,
                class: 'repo-par',
            });
            createAndAppend('p', this.container, {
                text: "Forks : " + repo.forks_count,
                class: 'repo-par',
            });
            createAndAppend('p', this.container, {
                text: "Updated : " + repo.updated_at,
                class: 'repo-par',
            });
        }

    }

    window.RepoView = RepoView;
}