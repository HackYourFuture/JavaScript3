// sort the data alphabetical
function toSortData(res) {
  let newRes = res.sort((a, b) => {
    let aA = a.name.toUpperCase();
    let bB = b.name.toUpperCase();
    if (aA < bB) {
      return -1;
    }
    if (aA > bB) {
      return 1;
    }
    return 0;
  });
  return newRes;
}
