console.log("lets write js")
async function getsongs(linkforsongs) {
    let a =await fetch(linkforsongs);
    let response = await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    // console.log(as);
    let songs=[];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]); // used splt to start from songs see the element how is that its a link 
        }
        
    }      

    // console.log(songs);
    return songs;
    
    
}


async function main(){

    let songs=await getsongs("http://127.0.0.1:3000/songs/")
    console.log(songs);

    let songsUL= document.querySelector(".songList").getElementsByTagName("ul")[0];


    // for (const Song of songs) {
    //     songsUL.innerHTML = songsUL.innerHTML + `<li> ${Song} </li>`;
    // }  before to remove unwaanted things in songs like %20

    // after

    for (const Song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li> ${Song.replaceAll("%20"," ")} </li>`;
    }

    var audio = new Audio(songs[1]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration,audio.currentTime);
        
});

    
}

main();
