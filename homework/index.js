'use strict';
{
	// function fetchJSON(url, cb) {
	// 	const xhr = new XMLHttpRequest();
	// 	xhr.open('GET', url);
	// 	xhr.responseType = 'json';
	// 	xhr.onload = () => {
	// 		if (xhr.status >= 200 && xhr.status <= 299) {
	// 			cb(null, xhr.response);
	// 		} else {
	// 			cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
	// 		}
	// 	};
	// 	xhr.onerror = () => cb(new Error('Network request failed'));
	// 	xhr.send();
	// }

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
	function contributorDetail(url) {
		let select = document.createElement('select');
		fetch(url).then((response) => response.json()).then((data) => {
			let byData = data;
			byData.sort((a, b) => a.name.localeCompare(b.name));
			byData.forEach((repo, index) => {
				let option = document.createElement('option');
				option.value = index;
				option.innerText = repo.name;
				select.appendChild(option);
			});
			select.addEventListener('click', () => {
				let repo = document.getElementById('repository');
				let sectionContributor = document.getElementById('contributor');
				if (repo.hasChildNodes()) {
					repo.removeChild(repo.lastChild);
				}
				while (sectionContributor.hasChildNodes()) {
					sectionContributor.removeChild(sectionContributor.lastChild);
				}

				fetch(`https://api.github.com/repos/HackYourFuture/
				${byData[select.value].name}/contributors`)
					.then((response) => response.json())
					.then((data) => {
						data.forEach((ele) => {
							let contributorDiv = document.createElement('div');
							contributorDiv.id = 'contributorDiv';
							let h4 = createAndAppend('h4', contributorDiv);
							let h5 = createAndAppend('h5', contributorDiv);
							let img = createAndAppend('img', contributorDiv);
							h4.innerText = ele.login;
							h5.innerText = ele.contributions;
							img.src = ele.avatar_url;
							sectionContributor.appendChild(contributorDiv);
						});
					});
				let ul = createAndAppend('ul', repo);
				renderRepoDetails(byData[select.value], ul);
			});
		});
		let header = document.getElementById('header');
		header.appendChild(select);
		let contributor = document.getElementById('contributor');
		while (contributor.hasChildNodes()) {
			contributor.removeChild(contributor.lastChild);
		}
	}
	function main(url) {
		fetch(url).then((res) => res.json()).then((data) => data).catch((err) => {
			createAndAppend('div', root, {
				text: err.message,
				class: 'alert-error'
			});
		});
		contributorDetail(url);
		renderRepoDetails(repo, ul);
	}

	const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
	window.onload = () => main(HYF_REPOS_URL);
}
