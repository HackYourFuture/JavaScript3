// the function to print the contributors
function printTheContributors(contributors) {
  let resData = contributors.data;
  let conLength = resData.length;
  let page_count = Math.ceil(conLength / 5);

  let pages = divideToPages(resData, page_count);

  printPagination(page_count);

  const store = document.getElementById('store');
  const right = document.getElementById('right');
  const left = document.getElementById('left');
  const btn = document.querySelectorAll('.btn');

  right.addEventListener('click', function() {
    clickRightLeft(true, btn, store, pages);
  });
  left.addEventListener('click', function() {
    clickRightLeft(false, btn, store, pages);
  });

  //Initiate page number one
  selectPage(pages, 0, btn, store);

  for (button of btn) {
    button.addEventListener('click', function() {
      let e = this.innerHTML - 1;
      selectPage(pages, e, btn, store);
    });
  }
}
