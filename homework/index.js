'use strict';

{
  const root = document.getElementById('root');
  const select = document.createElement('select');
  root.appendChild(select);
  const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      select.innerHTML = data.sort()
        .map(repo => `<option value="${repo.id}">${repo.name}</option>`).join("\n");
      select.addEventListener('change', function () {
        const chosenRepoId = +this.value;
        const currentRepo = data.find(repo => repo.id === chosenRepoId);
        document.getElementById('repoInfo').innerHTML = "Repositroy Name: " + currentRepo.name + "<br />" + "Description: " + currentRepo.description + "<br />" + "Forks: " + currentRepo.forks + "<br />" + "Update date: " + currentRepo.updated_at;
      });
    })
    .then(date => {
      const contributorsrUrl = currentRepo.contributors_url;
      const list = document.createElement('ul').className('contributors_list');
      const roota = document.getElementById('roota');
      roota.appendChild(list);
      fetch(contributorsrUrl)
        .then(resp => resp.json)
        .then(data => {
          list.innerHTML = data.sort().map(butor => '<li class ="contributers_item" ><img src="${butor.avatar_url}" /> </li>');
        });
    });
}
