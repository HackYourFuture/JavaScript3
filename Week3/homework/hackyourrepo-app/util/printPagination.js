// function to display the pagination
function printPagination(page_count) {
  let total_pages = '';
  for (j = 1; j <= page_count; j++) {
    total_pages += `<li class="pageBtn btn">${j}</li>`;
  }
  let doPages = `<br><div class="pagination ">
      <ul class="pageContainer">
        <li id="left" class="pageBtn">&lang;</li>${total_pages}<li id="right" class="pageBtn">&rang;</li>
      </ul>
    </div>`;
  document.getElementById('paginationId').innerHTML = doPages;
}
