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
        // contributors section code
        const cntbutorsUrl = currentRepo.contributors_url;
        fetch(cntbutorsUrl)
          .then(resp => resp.json())
          .then(resp => document.getElementById('repoContributers').innerHTML = resp.map(butor => `<ul class="contributor_list"><li class="contributor_item"><img src="${butor.avatar_url}" class="contributor-avatar"/><div class="contributor-data"><div>${butor.login}</div><div class="contributor-badge">${butor.contributions}</div></div></li></ul>`));
      });
    });

  // .then()
  // .then(respo => repo.json)
  // .then(data => {
  //   document.getElementById('repoContributers').innerHTML = data.map(repo => repo.login);
  // });
  // trying to render contributors_url and get its ifno to fill the contribuers square.
}
