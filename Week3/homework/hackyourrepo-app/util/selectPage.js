// to select the active page
function selectPage(pages, num, btn, store) {
  const contributor = document.getElementById('contributors_page');
  for (ii = 0; ii < btn.length; ii++) {
    if (btn[ii].innerHTML == num + 1) {
      btn[ii].classList.add('active');
      store.innerHTML = ii;
    } else {
      btn[ii].classList.remove('active');
    }
  }
  let outPut = '';
  if (pages.length != 0) {
    pages[num].forEach(element => {
      outPut += `
      <div class="contributors">
      <img src="${element.avatar_url}" alt="avatar" width="50px" />
      <a  href="${element.html_url}" class="userName" target="_blank" >
      ${element.login}</a>
      <div class="badge">${element.contributions}</div>
      </div >`;
    });
  }
  contributor.innerHTML = outPut;
}
