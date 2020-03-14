const postReg = new XMLHttpRequest();
postReg.open('get', "https://www.randomuser.me/api")
postReg.send();
const btn = document.getElementById("btn")
function get() {
    const data = JSON.parse(postReg.response)
    console.log(data)

};
btn.addEventListener("click", get);


axios.get("https://www.randomuser.me/api").then(function (event) {
    console.log(event.data)

});