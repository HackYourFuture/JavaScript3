'use strict';

{
	function fetchJSON(url, cb) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.responseType = 'json';
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status <= 299) {
				cb(null, xhr.response);
			} else {
				cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
			}
		};
		xhr.onerror = () => cb(new Error('Network request failed'));
		xhr.send();
	}

	function createAndAppend(name, parent, options = {}) {
		const elem = document.createElement(name);
		parent.appendChild(elem);
		Object.entries(options).forEach(([ key, value ]) => {
			if (key === 'text') {
				elem.textContent = value;
			} else {
				elem.setAttribute(key, value);
			}
		});
		return elem;
	}

	function renderRepoDetails(repo, ul) {
		const li = createAndAppend('li', ul);
		const table = createAndAppend('table', li);

		//const titles = [ 'Repository:', 'Description:', 'Forks:', 'Updated:' ];
		//const keys = [ 'name', 'description', 'forks', 'update_at' ];

		//for (let i of title ) { try to use loop of
		let tr = createAndAppend('tr', table); // i can not use const variable  here
		//Repository
		createAndAppend('th', tr, { text: 'Repository:' });
		let td = createAndAppend('td', tr);
		createAndAppend('a', td, {
			href: repo.html_url,
			text: repo.name,
			target: '_blank'
		});
		//Description
		tr = createAndAppend('tr', table);
		createAndAppend('th', tr, { text: 'Description:' });
		td = createAndAppend('td', tr, { text: repo.description });
		//Forks
		tr = createAndAppend('tr', table);
		createAndAppend('th', tr, { text: 'Forks:' });
		td = createAndAppend('td', tr, { text: repo.forks });
		//Updated
		tr = createAndAppend('tr', table);
		createAndAppend('th', tr, { text: 'Updated:' });
		td = createAndAppend('td', tr, { text: repo.updated_at });
	}

	function main(url) {
		createAndAppend('header', root, { text: 'HYF Repositories' });
		fetchJSON(url, (err, repos) => {
			const root = document.getElementById('root');
			if (err) {
				createAndAppend('div', root, {
					text: err.message,
					class: 'alert-error'
				});
				return;
			}

			const ul = createAndAppend('ul', root);
			// .sort and .localeCompare used then .forEach
			repos
				.sort((a, b) => a.name.localeCompare(b.name))
				.slice(0, 10)
				.forEach((repo) => renderRepoDetails(repo, ul));
		});
	}

	const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

	window.onload = () => main(HYF_REPOS_URL);
}
