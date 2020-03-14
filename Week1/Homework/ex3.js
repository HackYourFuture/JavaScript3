const btn2=document.getElementById("btn2")
const randomXhr=()=>{
    const xhr= new XMLHttpRequest();
    const ul = document.getElementById("ul")
    xhr.responseType="json";

    xhr.onload = ()=>{
        if (xhr.readyState===XMLHttpRequest.DONE) {
            const img=document.createElement("img")
            const li=document.createElement("li")
            img.setAttribute("src",xhr.response.message)
            li.appendChild(img)
            ul.appendChild(li)
        }else{
            console.log(xhr.status)
        }
   }
    xhr.open("GET","https://dog.ceo/api/breeds/image/random")
    xhr.send();
}

btn2.addEventListener("click",randomXhr)
   
const ul = document.getElementById("ul")
const btn1=document.getElementById("btn1")
const randomAxios=()=>{
   axios 
   .get("https://dog.ceo/api/breeds/image/random")
   .then(res=>{
       const img=document.createElement("img")
       const li=document.createElement("li")
       img.setAttribute("src",res.data.message)
       li.appendChild(img)
       ul.appendChild(li)
   })
   .catch(err=>{
       console.log("there is an error", err)
   })
}
btn1.addEventListener("click",randomAxios)

