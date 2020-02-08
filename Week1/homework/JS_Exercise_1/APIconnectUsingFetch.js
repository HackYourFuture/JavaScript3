

const fetchUserData = () => {
  console.log("Using fetch")
  fetch("https://randomuser.me/api/?results=5")
    .then((res) => {
      return res.json()
    })
.then((data) => {

      console.log(data)

    })

}

fetchUserData()





