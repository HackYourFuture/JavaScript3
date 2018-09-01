"use strict";

{
    function createAndAppend(name, parent, options = {}) {
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (key === "text") {
                elem.innerHTML = value;
            } else {
                elem.setAttribute(key, value);
            }
        });
        return elem;
    }

    function renderRepo(container, repository, linkName) {

        container.innerHTML = "";
        const table = createAndAppend("table", container, { class: "table" });
        const tr = createAndAppend("tr", table);
        const td = createAndAppend("td", tr, { text: "<b>Repository: </b> " });

        createAndAppend("a", td, {
            text: repository.html_url,
            text: linkName,
            href: repository.html_url,
            target: "_blank"
        });

        createAndAppend("td", createAndAppend("tr", table), { text: "<b>Description: </b>" + repository.description });
        if (repository.description === null) {
            repository.description = "no description";
        }

        createAndAppend("td", createAndAppend("tr", table), { text: "<b>Forks: </b> " + repository.forks });
        createAndAppend("td", createAndAppend("tr", table), { text: "<b>Updated: </b>" + new Date(repository.updated_at).toLocaleString() });

    };

    async function renderContributors(container, contributorsUrl) {

        const ul = createAndAppend("ul", container, { text: "<small>Contributions: ", class: "table" });
        const li = createAndAppend("li", ul);

        try {
            const response = await fetch(contributorsUrl);
            const contributorList = await response.json();

            contributorList.forEach((contributor) => {

                const linkToRepo = createAndAppend("a", li, {
                    href: contributor.html_url,
                    target: "_blank"
                });

                createAndAppend("img", linkToRepo, {
                    class: "avatar",
                    src: contributor.avatar_url,
                    width: "60"
                });

                createAndAppend("p", li, { text: contributor.login });
                createAndAppend("p", li, { text: contributor.contributions, class: "contributorsNumber" });
                createAndAppend("li", li, { class: "line", });
            });


        } catch (error) {

            return container.innerHTML = error.message;
        }
    };

    async function main(url) {
        const root = document.getElementById("root");

        const div = createAndAppend("div", root);
        const header = createAndAppend("h3", div, { text: "HYF Repositories  ", class: "header" });
        const select = createAndAppend("select", header, { class: "select" });
        const container = createAndAppend("div", root, { class: "container" });


        try {
            const response = await fetch(url);

            const repositoriesList = await response.json();

            if (!response.ok) {
                throw new Error(response.status + " " + response.statusText)
            }

            repositoriesList.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })

            repositoriesList.forEach((contributor, index) => {

                createAndAppend("option", select, { text: contributor.name, value: index });
            });

            select.addEventListener("change", (event) => {

                const index = event.target.value;

                renderRepo(container, repositoriesList[index], select[index].textContent);
                renderContributors(container, repositoriesList[index].contributors_url);
            });

            renderRepo(container, repositoriesList[0], select[0].textContent)
            renderContributors(container, repositoriesList[0].contributors_url);
        } catch (error) {
            createAndAppend("div", root, { text: error, class: "alert-error" });
        }
    }

    const HYF_REPOS_URL = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

    window.onload = () => main(HYF_REPOS_URL);
}