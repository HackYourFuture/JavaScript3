
"use strict"
{
  (function App() {
    document.getElementById("root").innerHTML = `
    <header><div class=selectfield><select id=selectmenu></select></div></header>
    <main>
    <section class=left>
    <div class=scy id=info-box>
    <div class=description>"No description"</div>
    <div class=forks>"No forks"</div>
    <div class=updated>"No data"</div>
    </div>
    <div id=size style=width:0></div>
    </section>
    <section class=right>
    <div id=contributors><div class=card>
    <a href="#">
    <figure><img src="https://avatars1.githubusercontent.com/u/39067270?s=400&u=b8a97121f8e8623492a3fd16de13cfa780409246&v=4"></figure>
    </a>
    <h2>Acimanx</h2>
    <p>contributions:53</p><div class=repos-count>123</div>
    </div>
    </div>
    </section>
    </main>`
  })()

  document.addEventListener("DOMContentLoaded", function (event) {

    const url = "https://api.github.com/orgs/HackYourFuture/repos?per_page=10"

    fetchJSON(url, function (err, data) {
      if (err) {
        document.getElementById("main").innerHTML = err
      }
      else {
        document.getElementById("selectmenu").innerHTML = `<option value=""disabled id=first selected>Choose your option</option>${data.map((x, b) => `<option value=${b} class=select>${x.name}</option>`).join("")}`
        document.getElementById("selectmenu").addEventListener("change", event => {
          document.getElementById("info-box").innerHTML = `<div class=description>${null == data[event.target.value].description ? "No description" : data[event.target.value].description}</div><div class=forks>${null == data[event.target.value].forks ? "No forks" : data[event.target.value].forks}</div><div class=updated>${null == data[event.target.value].updated_at ? "No data" : data[event.target.value].updated_at}</div>`
          let repositories
          let repoData
          fetchJSON(data[event.target.value].contributors_url, (err, contributorData) => {
            repositories = contributorData
            repoData = repositories.forEach(({ login }) => {
              let usersData
              fetchJSON(`https://api.github.com/users/${login}`, (err, fetchUsersData) => {
                usersData = fetchUsersData.name
                console.log(usersData)
              })
            })
            console.log(repoData)
            outputPageContent(repoData)
          })
          function outputPageContent() {
            document.getElementById("contributors").innerHTML = repositories.map(a => `<div class=card><a href=${a.html_url} target=_blank><figure><img src=${a.avatar_url}></figure></a><h2>${a.login}</h2><p id=reposdata>${console.log(repoData)}<p>contributions: ${a.contributions}<div class=repos-count></div></div>`).join("")
          }
        }, !1)
      }
    })
  })

  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response)
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`))
      }
    }
    xhr.onerror = () => cb(new Error('Network request failed'))
    xhr.send()
  }
}