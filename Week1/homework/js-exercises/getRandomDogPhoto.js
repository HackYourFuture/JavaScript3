'use strict'

//XML
function getRandomPhotoXML(){
    const xhr = new XMLHttpRequest()
    xhr.responseType = "json";
    xhr.onload = function() {
        if (xhr.status < 400) {
            let randomImage = xhr.response.message
            let list = document.getElementById('list')
            let listItem = document.createElement('li')
            //manipulating the list appearance
            list.style.display = "flex"
            list.style.alignItems = "center"
            list.style.flexWrap = "wrap"
            list.style.listStyle = "none"

            //appending list and items
            let image = document.createElement('img')
            list.appendChild(listItem)
            listItem.appendChild(image)
            image.src = randomImage
            //resizing the image and putting a border
            image.style.width = "100px"
            image.style.border= "thick solid #f4c416"
       
        } else {
            console.log('Error!', xhr.status)
        };
    };

    xhr.onerror = function() {
        console.log('Error!', xhr.status )
    };

    const url = 'https://dog.ceo/api/breeds/image/random'
    xhr.open('GET', url);
    xhr.send();
   
};
//centering buttons
document.body.style.textAlign = "center"

let xmlButton = document.getElementById('xmlButton')
xmlButton.style.backgroundColor= "#f4c416"
xmlButton.style.color= "white"
xmlButton.addEventListener('click', getRandomPhotoXML )
//end of first function; HTTP request using XML

//Axiom
function getRandomPhotoAxios(){
  
    const url = `https://dog.ceo/api/breeds/image/random`
  
    axios.get(url)
      .then(function (response) {
        //get response
        let randomImage = response.data.message
        let list = document.getElementById('list')
        let listItem = document.createElement('li')

        //manipulating the list appearance
        list.style.display = "flex"
        list.style.alignItems = "center"
        list.style.flexWrap = "wrap"
        list.style.listStyle = "none"
        
        let image = document.createElement('img')
       
        list.appendChild(listItem)
        listItem.appendChild(image)
        image.src = randomImage
        //resizing the image and putting a red border
        image.style.width = "100px"
        image.style.border= "thick solid #851e24"
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
};



let axiomButton = document.getElementById('axiomButton');
axiomButton.style.backgroundColor= "#851e24";
axiomButton.style.color= "white";
axiomButton.addEventListener('click', getRandomPhotoAxios );


