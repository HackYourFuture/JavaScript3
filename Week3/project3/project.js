const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";
  const HyfReposHttps = async ()=>{
    const response = await axios(url);
    return response;
  }
  async function check(){
   const data= await HyfReposHttps();
   if(data.status==200){
    SelectElement(data)
   }else{
     console.log("there is an error")
   }
  }
  check()
async function SelectElement(data){
  console.log(data)
    let selectElement = document.getElementById('repositories');
    data.data.forEach(rep => {
    let option = document.createElement('option');
    option.text = rep.name;
    option.value = rep.id;
    selectElement.appendChild(option);
    SelectChang(data);
  });
}
function SelectChang (data) {
    let selectElement = document.getElementById('repositories');
    selectElement.addEventListener('change', function(){
    const selectValue = selectElement.value;
    const repo = data.data.find(repo => repo.id == selectValue);
    renderInfo(repo);
    const repoContributersUrl = repo.contributors_url;
    fetch(repoContributersUrl)
      .then (data =>{return data.json()} )
      .then(data=> renderConterbute(data))
      .catch(err => renderError(err));
  });
}
function renderInfo(repo){
  const repositoriesInfoElement = document.querySelector('#repo_info');
  repositoriesInfoElement.innerHTML =``;
  repositoriesInfoElement.innerHTML =`<div class=“repoContainer”>
                                    <h2>Repository:  </h2><span><a href=${repo.html_url}>${repo.name}</a></span><br>
                                    <h2>Description:  </h2><span>${repo.description}</span><br>
                                    <h2>Forks:  </h2><span>${repo.forks}</span><br>
                                    <h2>Updated:  </h2><span>${repo.updated_at}</span><br>
                                    </div>`;
}
function renderConterbute(response){
  console.log('calling renderConterbute');
   const repoContributers = document.querySelector('#repo_contributors');
    repoContributers.innerHTML =``;
    response.forEach(function(item){
    repoContributers.innerHTML += `<div class=“contributorContainer”>
                                   <div class=“contributorList”><h2>${item.login}</h></div>
                                   <div class=“contributorList”><img src=${item.avatar_url}></div>
                                   <div class=“contributorList”><h2>${item.contributions}</h2></div>
                                   </div>`;
  });
}
