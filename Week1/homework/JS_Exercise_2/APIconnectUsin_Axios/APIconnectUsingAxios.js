const axiosFetchData = () => {

  console.log("fetching data using axios")
  
  axios.get('https://randomuser.me/api/?results=3')
  
  .then((response) => {
  
  // handle success
  
  console.log(response.data);
  
  })
  
  }
  
  ​
  
  axiosFetchData()
  
  
  