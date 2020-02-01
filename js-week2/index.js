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

    // load document and add it to ul 
    function loadDoc(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const data = JSON.parse(xhttp.response);
                data.forEach(ele => {
                    const txt = `<img src="${ele.avatar_url}"> ${ele.login} ${ele.contributions}`;
                    creatLi(txt);
                });

            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    function fetchJSON(url) {
        const hyfRepo = new XMLHttpRequest();

        function reqListener() {
            const facts = JSON.parse(this.response);
            let arr = [];
            for (let i in facts) {
                arr.push([{ "name": facts[i].name }, { "description": facts[i].description }, { "forks_count": facts[i].forks_count }, { "updated_at": facts[i].updated_at }]);
            }

            arr.forEach((ele, i) => {
                creatOption(ele[0].name, i);
            });

            console.log(facts);

            select.addEventListener('change', () => {
                contri.innerHTML = "";
                let s = select.value;

                let txt = "<strong>Repository : </strong>" +
                    facts[s].name +
                    "<br>" +
                    "<strong>Description : </strong>" +
                    facts[s].description +
                    "<br>" +
                    "<strong>Forks : </strong>" +
                    facts[s].forks_count +
                    "<br>" +
                    "<strong>Updated : </strong>" +
                    facts[s].updated_at;

                repoDiv.innerHTML = txt + s;
                let link = facts[s].contributors_url;

                loadDoc(link);
            });


        }

        hyfRepo.open("GET", url, true);
        hyfRepo.send();
        hyfRepo.addEventListener("load", reqListener);
    }


    return fetchJSON(url);
}

main(HYF_REPOS_URL);