const HYF_REPOS_URL =
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=10";

const root = document.querySelector("#root");

function main(url) {
    function creatLi(txt) {
        const liRepo = document.createElement("li");
        liRepo.innerHTML = txt;
        const ulRepo = document.createElement("ul");
        ulRepo.appendChild(liRepo);
        root.appendChild(ulRepo);
    }

    function fetchJSON(url) {
        const hyfRepo = new XMLHttpRequest();

        function reqListener() {
            const facts = JSON.parse(this.response);

            for (i in facts) {
                const liTxt =
                    "<strong>Repository : </strong>" +
                    facts[i].name +
                    "<br>" +
                    "<strong>Description : </strong>" +
                    facts[i].description +
                    "<br>" +
                    "<strong>Forks : </strong>" +
                    facts[i].forks_count +
                    "<br>" +
                    "<strong>Updated : </strong>" +
                    facts[i].updated_at;
                creatLi(liTxt);
            }
        }

        hyfRepo.open("GET", url, true);
        hyfRepo.send();
        hyfRepo.addEventListener("load", reqListener);
    }

    return fetchJSON(url);
}

main(HYF_REPOS_URL);