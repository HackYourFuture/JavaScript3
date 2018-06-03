
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.github.com/users/neveenatik", true);
xhr.send();
xhr.onreadystatechange = processRequest;

function processRequest() {
  if (xhr.readyState == XMLHttpRequest.DONE ) {
    let result = xhr.response;
    console.log(result);
    result = JSON.parse(result);
    renderDataToDom(result);
  }
}

function renderDataToDom(someData){
  let newList = creatHTMLElement('ul');
  for ( let property in someData) {
    let newItem = creatHTMLElement('li', newList);
    newItem.innerText = someData[property];
  }
}

function creatHTMLElement(tag, parent){
  let item = document.createElement(tag);
  if (parent){
    parent.appendChild(item);
  } else {
    document.body.appendChild(item);
  }
  return item;
}