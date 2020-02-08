var myButton = document.querySelector("#myButton")
myButton.addEventListener("click",doSomething,false)

function doSomething(e) {

var request = new XMLHttpRequest()

request.open('GET', 'https://dog.ceo/api/breeds/image/random', true)
request.onload = function() {
 const data = JSON.parse(this.response);
console.log(data);
  
}

request.send()

}