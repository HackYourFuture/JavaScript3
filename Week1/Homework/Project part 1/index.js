{ 
const root=document.getElementById("root")

function fetchJSON(url, cb){
    const xhr= new XMLHttpRequest();
    xhr.open("GET",url)
    xhr.responseType="json"
    xhr.onload=()=>{
        if(xhr.status>=200 && xhr.status<=300){
            cb(undefined, xhr.response)
        }else{
            cb(new Error(`it is an error : ${xhr.status} - ${xhr.statusText}`))
        }
    }
    xhr.send()
}
function main(url){
    createAndAppend("h3",root,{ text:"HYF repositories"})
    fetchJSON(url,(error,response)=>{
        if(error){
            createAndAppend("div",root,{text:error.message,class:`alert-error`});
            return;
        }
        const ul = createAndAppend("ul",root)
        response.sort((curRepo,nextRepo)=>{
            curRepo.name.localeCompare(nextRepo.name)

        })
        .forEach(repo=>repoDetails(repo,ul));

    })
}
function repoDetails(repo,ul) {
    const li=createAndAppend("li", ul)
 const table=createAndAppend("table",li)    
 const titles = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
 const dataKeys = ['name', 'description', 'forks', 'updated_at'];
 for (let i = 0; i < titles.length; ++i) {
   const tr = createAndAppend('tr', table);
   createAndAppend('th', tr, { text: titles[i] });
   if (i > 0 ){
     createAndAppend('td', tr, { text: repo[dataKeys[i]] });
   } else {
     const td = createAndAppend('td', tr);
     createAndAppend('a', td, {
       href: repo.html_url,
       text: repo.name,
       target: '_blank',
     });
   }
 }
}

function createAndAppend(name, parent, options = {}) {
 const el = document.createElement(name);
 parent.appendChild(el);
 Object.entries(options).forEach(([key, value]) => {
   if (key === 'text') {
     el.textContent = value;
   } else {
     el.setAttribute(key, value);
   }
 });
 return el;
};

const HYF_REPOS_URL ='https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
};

