// load the data for HackYourRepos
async function getData(url) {
  const response = await fetch(url);
  const resData = await response.json();
  printData(resData);
}
