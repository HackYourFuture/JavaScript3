// the function to print the contributors
function printTheContributors(contributors) {
  const contributor = document.getElementById('contributor');
  let resData = contributors.data;
  let outPut = `<div class="contributors">
  <h2>Contributors</h2 >
  </div >`;
  resData.forEach(element => {
    outPut += `
      <div class="contributors">
      <img src="${element.avatar_url}" alt="avatar" width="50px" />
      <a  href="${element.html_url}" class="userName" target="_blank" >
      ${element.login}</a>
      <div class="badge">${element.contributions}</div>
      </div ><br>`;
  });
  contributor.innerHTML = outPut;
}
