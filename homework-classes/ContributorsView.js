'use strict';

{
	const { createAndAppend } = window.Util;

	class ContributorsView {
		constructor(container) {
			this.container = container;
		}

		update(state) {
			if (!state.error) {
				this.render(state.contributors);
			}
		}

		/**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
		render(contributors) {
			// TODO: replace this comment and the console.log with your own code
			this.container.innerHTML = '';
			contributors.forEach((ele) => {
				const mainDiv = document.querySelector('.contributors-container');
				console.log(mainDiv);

				const contributorsDiv = createAndAppend('div', mainDiv, {
					class: 'contributorsDiv'
				});

				const contArray = [ ele.avatar_url, ele.login, ele.contributions ];

				const div = createAndAppend('div', contributorsDiv, {
					class: 'ImgDiv'
				});
				const img = createAndAppend('img', div);

				img.src = contArray[0];

				const loginDiv = createAndAppend('div', contributorsDiv, {
					class: 'login'
				});

				createAndAppend('a', loginDiv, {
					text: contArray[1],
					href: ele.html_url,
					target: '_blank'
				});

				const buttonDiv = createAndAppend('div', contributorsDiv, {
					class: 'buttonDiv'
				});
				createAndAppend('button', buttonDiv, { text: contArray[2] });
			});

			console.log('ContributorsView', contributors);
		}
	}

	window.ContributorsView = ContributorsView;
}
