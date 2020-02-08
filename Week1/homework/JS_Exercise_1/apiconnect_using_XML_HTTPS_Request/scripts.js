var request = new XMLHttpRequest()

request.open('GET', 'https://www.randomuser.me/api', true)
request.onload = function() {
 const data = JSON.parse(this.response);
console.log(data);
  
}

request.send()