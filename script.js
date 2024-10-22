console.log("lets write js")

let currentSong= new Audio();

function convertSecondsToMinutes(seconds) {
    // Ensure the input is a non-negative integer
    if (seconds < 0) {
        return "00:00"; // Return 00:00 for negative input
    }

    // Round seconds to the nearest whole number
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted time in MM:SS
    return `${formattedMinutes}:${formattedSeconds}`;
}


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

const playmusic = async (track,pause=false)=>{
    //let audio = new Audio("/songs/" + track.trim()); // this wont work because each time it will parallely create a separate audio obj
    currentSong.src= "/songs/" + track.trim()
    if(!pause){
    console.log(currentSong);
    currentSong.play();
    play.src="svgs/pausebtn.svg";

    }
    document.querySelector(".songInfo").innerHTML=decodeURI(track);
    document.querySelector("songTime").innerHTML="00:00"
    
    

}


async function main(){


   

    let songs=await getsongs("http://127.0.0.1:3000/songs/")
    console.log(songs);
    playmusic(songs[0],true)

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
    if(currentSong.paused){
        currentSong.play();
        play.src="svgs/pausebtn.svg";
    }
    else{
        currentSong.pause();
        play.src="svgs/playbtn.svg";
        }
  })

  currentSong.addEventListener("timeupdate",()=>{
   // console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songTime").innerHTML=`${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime)/(currentSong.duration)*100 + "%";
  })

   document.querySelector(".seekbar").addEventListener("click",e=>{
   let seekPercent=  (e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left = seekPercent + "%";
  currentSong.currentTime=((currentSong.duration)*seekPercent)/100;
  })

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"+"%";
  })
  
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100"+"%";
  })

  document.querySelector("#previous").addEventListener("click",()=>{             //#previous becuase its a id , but fot class we use .previous rememebr
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(currentSong.src.split("/").slice(-1));
    if((index-1)>=0){
      playmusic(songs[index-1]);
    }
  })

  document.querySelector("#next").addEventListener("click",()=>{             //#previous becuase its a id , but fot class we use .previous rememebr
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(currentSong.src.split("/").slice(-1));
    if((index+1) < songs.length){
      playmusic(songs[index+1]);
    }
  })
     
  document.querySelector(".volume").addEventListener("click", () => {
    const rangeElement = document.querySelector(".range");
    
    if (rangeElement.style.display === "inline-block") {
      rangeElement.style.display = "none"; // Hide the element
    } else {
      rangeElement.style.display = "inline-block"; // Show the element
    }
  });

    
}

main();
