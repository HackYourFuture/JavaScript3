// Function to print the options in the select (list)
function printData(res) {
  //declare variables
  const selectRepo = document.getElementById('selectRepo');
  const repo = document.getElementById('repo');
  const description = document.getElementById('desc');
  const forks = document.getElementById('fork');
  const updated = document.getElementById('upDate');

  let names = toSortData(res);
  let selectOptions =
    '<option value="" disabled selected>Choose Repository....</option>';
  for (let i = 0; i < res.length; i++) {
    selectOptions += '<option value="' + i + '">' + names[i].name + '</option>';
  }

  // fill the list with data
  selectRepo.innerHTML = selectOptions;

  // Event Listener for select
  selectRepo.addEventListener('change', function() {
    //insert the information of the selected repo
    let url_repo = `<a href="https://github.com/HackYourFuture/${
      res[this.value].name
    }" 
      target="_blank">${res[this.value].name}</a>`;

    // to print the date format in nice way // it is long code but at the time been it works.
    let dat = res[this.value].updated_at.split('T');
    let tim = dat[1].slice(0, dat[1].length - 1);
    repo.innerHTML = url_repo;
    description.innerText = res[this.value].description;
    forks.innerText = res[this.value].forks;
    updated.innerText = dat[0] + '  ' + tim;

    // identify the url for the contributors
    let urlCont =
      'https://api.github.com/repos/HackYourFuture/' +
      res[this.value].name +
      '/contributors';

    // call the function
    getTheContributors(urlCont).catch(err =>
      console.log(err + ', Please Ismaiel check the error!'),
    );
  });
}
