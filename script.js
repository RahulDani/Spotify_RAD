console.log("lets write js")

let currentSong= new Audio();
let cuurFolder;
let songs;

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

async function getsongs(folder) {
    cuurFolder=folder;
    let a =await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    // console.log(as);
    songs=[];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]); // used splt to start from songs see the element how is that its a link 
        }
    }      

    let songsUL= document.querySelector(".songList").getElementsByTagName("ul")[0];
    songsUL.innerHTML="";
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
  return songs;
    // console.log(songs);
}

const playmusic = async (track,pause=false)=>{
    //let audio = new Audio("/songs/" + track.trim()); // this wont work because each time it will parallely create a separate audio obj
    currentSong.src= `/${cuurFolder}/` + track.trim()
    if(!pause){
    console.log(currentSong);
    currentSong.play();
    play.src="svgs/pausebtn.svg";

    }
    document.querySelector(".songInfo").innerHTML=decodeURI(track);
    document.querySelector("songTime").innerHTML="00:00"
}

async function displayalbm() {
  let a =await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let anschors = div.getElementsByTagName("a");
    let cardContainer= document.querySelector(".cardContainer");
    let array= Array.from(anschors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
        console.log(e.href.split("/").slice(-2)[0])
        let folder = e.href.split("/").slice(-2)[0];
        let aa =await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
        let response = await aa.json();
        console.log(response);
        cardContainer.innerHTML=  cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                                <!-- Green circle background -->
                                <circle cx="12" cy="12" r="10" fill="#1DB954" />

                                <path
                                    d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                                    fill="none" stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img class="rounded" src="songs/${folder}/cover.jpg" alt="" srcset="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

      }
    }

      Array.from(document.getElementsByClassName("card")).forEach(e=>{            // this is to load the songs for the playlist which we click
    e.addEventListener("click",async item=>{
      console.log(item, item.currentTarget.dataset);
      songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      playmusic(songs[0])
    })
  })
  
}

async function main(){

    await getsongs("songs/juice")
    console.log(songs);
    playmusic(songs[0],true)

    displayalbm();

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

//   or using getElementsByClassName
//   document.getElementsByClassName("seekbar")[0].addEventListener("click", e => {
//     let seekPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//     document.getElementsByClassName("circle")[0].style.left = seekPercent + "%";
//     currentSong.currentTime = ((currentSong.duration) * seekPercent) / 100;
// });


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
  // to make range work to increase and reduce volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("Setting volume to ",e.target.value,"/100");
    currentSong.volume= parseInt(e.target.value)/100;
  })

}


main();
