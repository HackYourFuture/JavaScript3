//to divide the contributors to pages
function divideToPages(resData, page_count) {
  let start = 0;
  let pages = [];
  for (y = 0; y < page_count; y++) {
    pages.push(resData.slice(start, start + 5));
    start += 5;
  }
  return pages;
}
