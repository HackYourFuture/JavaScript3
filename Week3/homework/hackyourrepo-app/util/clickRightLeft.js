// This is for page right and left
function clickRightLeft(f, btn, store, pages) {
  let sto = store.innerHTML;
  let page_number = btn[sto].innerHTML;

  if (f && sto < btn.length - 1) {
    sto++;
    selectPage(pages, sto, btn, store);
  } else if (!f && sto >= 1) {
    sto--;
    selectPage(pages, sto, btn, store);
  }
}
