'use strict';

const HYF_REPOS_URL =
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=10";

const root = document.querySelector("#root");
const select = document.querySelector("#repo");
const repoContaine = document.querySelector('.repo-containe');
const repoDiv = document.querySelector('#repoDiv');
const op = document.querySelector('option');
const contri = document.querySelector('#contri');


function main(url) {

    // to creat ul and li element
    function creatLi(txt) {
        const liRepo = document.createElement("li");
        liRepo.innerHTML = txt;
        const ulRepo = document.createElement("ul");
        ulRepo.appendChild(liRepo);
        contri.appendChild(ulRepo);
    }

    // to creat option element and append it to to select 
    function creatOption(txt, num) {
        let opt = document.createElement('option');

        opt.textContent = txt;
        opt.setAttribute('value', num);
        select.appendChild(opt);
    }

    // load data of contributors and add it to ul 
    async function loadDoc(url) {
        try {
            const response = await axios.get(url);
            const data = response.data;

            data.forEach(ele => {
                const txt = `<img src="${ele.avatar_url}"> ${ele.login} ${ele.contributions}`;
                creatLi(txt);
            });

        } catch (error) {
            console.error(error);
        }

    }

    // load data and add it to div
    async function fetchJSON(url) {
        try {
            const response = await axios.get(url);

            const data = response.data;
            let arr = [];

            for (let i in data) {
                arr.push([{ "name": data[i].name }, { "description": data[i].description }, { "forks_count": data[i].forks_count }, { "updated_at": data[i].updated_at }]);
            }

            arr.forEach((ele, i) => {
                creatOption(ele[0].name, i);
            });

            select.addEventListener('change', () => {
                contri.innerHTML = "";
                let s = select.value;

                let txt = "<strong>Repository : </strong>" +
                    data[s].name +
                    "<br>" +
                    "<strong>Description : </strong>" +
                    data[s].description +
                    "<br>" +
                    "<strong>Forks : </strong>" +
                    data[s].forks_count +
                    "<br>" +
                    "<strong>Updated : </strong>" +
                    data[s].updated_at;

                repoDiv.innerHTML = txt + s;
                let link = data[s].contributors_url;

                loadDoc(link);
            });

        } catch (error) {
            console.error(error);
        }

    }

    return fetchJSON(url);
}

main(HYF_REPOS_URL);