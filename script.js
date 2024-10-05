console.log("lets write js")

let currentSong= new Audio();

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

const playmusic = async (track)=>{
    //let audio = new Audio("/songs/" + track.trim()); // this wont work because each time it will parallely create a separate audio obj
    currentSong.src= "/songs/" + track.trim()
    console.log(currentSong);
    currentSong.play();
    
    

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
        songsUL.innerHTML = songsUL.innerHTML + `<li><img style="width: 20px;" class="invert" src="svgs/music.svg" alt="" srcset="">
                            <div class="info">
                                <div class="song_name">
                                ${Song.replaceAll("%20"," ")} 
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert " src="svgs/playbtn.svg" alt="" srcset="">
                            </div>
                        
        
        
        
        </li>`;
    }


  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);  
        playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
  })

  play.addEventListener("click",()=>{
    console.log("play button clicked");
    if(currentSong.paused){
        currentSong.play();
        play.src="svgs/pausebtn.svg";
    }
    else{
        currentSong.pause();
        play.src="svgs/playbtn.svg";
        }
  })


    
}

main();
