'use strict';

function main() {

    const mainDiv = document.getElementById('root');

    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    function dataRequest(url) {

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = "json";
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
                }
            };
            xhr.onerror = () => reject(networkError());
            xhr.send();
        });
    }

    function networkError() {
        document.body.innerHTML = ('<h1><i class="fa fa-exclamation-triangle fa-2x"></i><br>There is no Internet connection <br> Please check the network and try again.</h1>')
    }

    async function gettingData() {
        try {
            let repositoryData = await dataRequest(url);
            createSelection(repositoryData);
        }
        catch (error) {
            handleError(mainDiv);
        }
    }
    gettingData();


    function handleError(tag) {
        tag.innerHTML = ('Network Error: 404 Not Found');
        tag.style.backgroundColor = 'red';
        tag.style.padding = '30px';
    }

    //HTML Content creator
    function createHTMLElement(tag, parent, text) {
        const newElement = document.createElement(tag);

        (text) ? newElement.innerHTML = text : '';

        if (parent) {
            parent.appendChild(newElement);
        } else {
            document.body.appendChild(newElement);
        }

        return newElement;
    }

    //This function creates multiple attributes
    function setAttributes(el, attrib) {
        for (const key in attrib) {
            el.setAttribute(key, attrib[key]);
        }
    }

    const logo = createHTMLElement('img', mainDiv);

    setAttributes(logo, {
        'src': 'http://hackyourfuture.net/images/logo/logo-01.svg',
        'alt': 'hack-your-future-school-logo',
        'class': 'logo'
    });


    const label = createHTMLElement('label', mainDiv, 'Select repository:  ');

    const select = createHTMLElement('select', label);
    setAttributes(select, { 'class': 'repository-selector' });

    const wrapper = createHTMLElement('div', mainDiv);
    setAttributes(wrapper, { 'class': 'wrapper' });

    const divRepInfo = createHTMLElement('div', wrapper);
    setAttributes(divRepInfo, { 'class': 'repository-info-div' });

    const ulRepInfo = createHTMLElement('ul', divRepInfo);
    setAttributes(ulRepInfo, { 'class': 'repository-info' });

    const divContribInfo = createHTMLElement('div', wrapper);
    setAttributes(divContribInfo, { 'class': 'contributors-info-div' });

    const ulContribInfo = createHTMLElement('ul', divContribInfo)
    setAttributes(ulContribInfo, { 'class': 'contributor-info' });

    function createSelection(repositories) {

        repositories.sort((a, b) => a.name.localeCompare(b.name))

        repositories.forEach((repository, prop) => {
            const options = createHTMLElement('option', select, repositories[prop].name);

            setAttributes(options, { 'value': prop });
        });

        select.addEventListener('change', () => {
            detailsOfRepository(repositories[select.value]);

        });
        detailsOfRepository(repositories[0]);
    }


    function detailsOfRepository(repository) {

        ulRepInfo.innerHTML = '';

        const liRepInfo = createHTMLElement('li', ulRepInfo);

        let [...repositoryDetails] = liRepInfo.children;

        repositoryDetails[0] = createHTMLElement('i', liRepInfo);

        setAttributes(repositoryDetails[0], {
            'class': 'fa fa-github fa-5x',
            'aria-label': 'GitHub logo'
        });

        repositoryDetails[1] = createHTMLElement('li', liRepInfo, 'Repository: '.bold());

        const a = createHTMLElement('a', repositoryDetails[1], repository.name);

        if (repository.description !== null) {
            repositoryDetails[2] = createHTMLElement('li', liRepInfo, 'Description: '.bold() + repository.description);
        }

        repositoryDetails[3] = createHTMLElement('li', liRepInfo, 'Forks: '.bold() + repository.forks);
        repositoryDetails[4] = createHTMLElement('li', liRepInfo, 'Updated: '.bold() + repository.updated_at.substring(0, 10));

        setAttributes(a, {
            'href': repository.html_url,
            'target': '_blank'
        });

        //tabindex:'0' attribute allows elements, besides links and form, to receive keyboard focus ,when navigating with the Tab key
        [...repositoryDetails].forEach((li) =>
            setAttributes(li, {
                'tabindex': '0'
            }));

        contributorsInfo(repository.contributors_url);
    }

    async function contributorsInfo(url) {

        try {
            ulContribInfo.innerHTML = '';

            const contributors = await dataRequest(url);

            contributors.forEach((contributor, prop) => {

                const liContribInfo = createHTMLElement('li', ulContribInfo);
                setAttributes(liContribInfo, { 'class': 'contributions-list' });

                let [...contribDetails] = liContribInfo.children;

                contribDetails[0] = createHTMLElement('a', liContribInfo);
                setAttributes(contribDetails[0], {
                    'href': contributors[prop].html_url,
                    'target': '_blank'
                });

                const contributorsAvatar = createHTMLElement('img', contribDetails[0]);
                setAttributes(contributorsAvatar, {
                    'src': contributors[prop].avatar_url,
                    'alt': 'contributors photo'
                });

                contribDetails[1] = createHTMLElement('li', liContribInfo, 'Username: '.bold() + contributors[prop].login);
                setAttributes(contribDetails[1], { 'class': 'contributors-name' });

                contribDetails[2] = createHTMLElement('li', liContribInfo, 'Contributions: '.bold() + contributors[prop].contributions);
                setAttributes(contribDetails[2], { 'class': 'contributions-counter' });

                [...contribDetails].forEach((li) => setAttributes(li, {
                    'tabindex': '0'
                }));
            });
        }
        catch (error) {
            handleError(ulContribInfo)
        }
    }
}
window.addEventListener('load', main);