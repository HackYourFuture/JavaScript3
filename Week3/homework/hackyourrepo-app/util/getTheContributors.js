// the function to get the contributors
async function getTheContributors(urlC) {
  await axios.get(urlC).then(respon => printTheContributors(respon));
}
