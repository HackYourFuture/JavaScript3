const img = document.querySelector('#img')

// const postReg= new XMLHttpRequest();
// postReg.open('get',"https://xkcd.now.sh/?comic=614")
// postReg.send();

// postReg.addEventListener('load', function(){
//     console.log(JSON.parse(postReg.response) )
//     const link  =JSON.parse(postReg.response).img;
//     img.src=link;
//     document.body.appendChild(img);
// });

axios
.get("https://xkcd.now.sh/?comic=614")
.then(function(res){
    console.log(res.data.img)
    const imgSrc = res.data.img;
    img.src =imgSrc
 
    })
    .catch(err =>{
        console.log("there is an error", err)
    })
    .finaly
