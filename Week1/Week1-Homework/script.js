'use strict';

function main() {

    const mainDiv = document.getElementById('root');

    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    function dataRequest(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.status < 400) {
                cb(null, xhr.response);
            } else {
                cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => cb(new Error('Network request failed'));
        xhr.send();
    }

    dataRequest(url, (error, data) => {
        if (error) {
            mainDiv.innerHTML = ('Network Error: 404 Not Found');
            mainDiv.style.backgroundColor = 'red';
            mainDiv.style.padding = '30px';

        } else {
            createSelection(data);
        }
    });

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
        'alt': 'hyf-logo',
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
        const i = createHTMLElement('i', liRepInfo);
        setAttributes(i, { 'class': 'fa fa-github fa-5x' });

        const liRepName = createHTMLElement('li', liRepInfo, 'Repository: '.bold());
        const a = createHTMLElement('a', liRepName, repository.name);

        if (repository.description !== null) {
            const liDesc = createHTMLElement('li', liRepInfo, 'Description: '.bold() + repository.description);
        }

        const liForks = createHTMLElement('li', liRepInfo, 'Forks: '.bold() + repository.forks);
        const liUpdates = createHTMLElement('li', liRepInfo, 'Updated: '.bold() + repository.updated_at.substring(0, 10));

        setAttributes(a, {
            'href': repository.html_url,
            'target': '_blank'
        });

        contributorsInfo(repository.contributors_url);
    }

    function contributorsInfo(url) {

        ulContribInfo.innerHTML = '';

        dataRequest(url, (error, contributors) => {
            if (error) {
                ulContribInfo.innerHTML = ('Network Error: 404 Not Found');
                ulContribInfo.style.backgroundColor = 'red';
                ulContribInfo.style.padding = '30px';
            }
            else {
                contributors.forEach((contributor, prop) => {
                    const liContribInfo = createHTMLElement('li', ulContribInfo);
                    setAttributes(liContribInfo, { 'class': 'contributions-list' });

                    const aContribUrl = createHTMLElement('a', liContribInfo);
                    setAttributes(aContribUrl, {
                        'href': contributors[prop].html_url,
                        'target': '_blank'
                    });

                    const contributorsAvatar = createHTMLElement('img', aContribUrl);
                    setAttributes(contributorsAvatar, {
                        'src': contributors[prop].avatar_url,
                        'alt': 'contributors photo'
                    });

                    const contributorsName = createHTMLElement('div', liContribInfo, 'Username: '.bold() + contributors[prop].login);
                    setAttributes(contributorsName, { 'class': 'contributors-name' });

                    const contributionsCounter = createHTMLElement('div', liContribInfo, 'Contributions: '.bold() + contributors[prop].contributions);
                    setAttributes(contributionsCounter, { 'class': 'contributions-counter' });
                });
            }
        });
    }
}
window.addEventListener('load', main);
