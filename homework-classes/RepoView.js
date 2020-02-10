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
			// TODO: replace this comment and the console.log with your own code
			this.container.innerHTML = '';

			const table = createAndAppend('table', this.container);

			table.innerHTML += `
			  <tr>
				<td> <strong> Repository: </td> </strong>
				<td><a href='${repo.html_url}' target='_blank'>${repo.name}</a></td>
			  </tr>
			  <tr>
				<td> <strong>Description: </td> </strong>
				<td>${repo.description}</td>
			  </tr>
			  <tr>
				<td> <strong> Forks:</td> <strong>
				<td>${repo.forks}</td>
			  </tr>
			  <tr>
				<td> <strong> Updated:</td> <strong>
				<td>${repo.updated_at}</td>
			  </tr>
			`;

			console.log('RepoView', repo);
		}
	}

	window.RepoView = RepoView;
}
