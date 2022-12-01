import { left_nav, top_nav_login, playerBottom } from "../utils/components.js";
import {refreshToken,getTrack} from "../utils/api_calls.js";

// refreshToken();

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const background = document.querySelectorAll('.background_color')[0];
const nav_bottom = document.querySelector('#page_bottom');


let TOKEN  = (localStorage.getItem("spotify_token")) || "";
let playlistID = localStorage.getItem("spotify_curr_playlist") || "";

nav_top_container.style.backgroundColor = "black";
nav_top_container.innerHTML = top_nav_login();
nav_bottom.innerHTML = playerBottom();
nav_left_container.innerHTML = left_nav();


const renderingTheData = (data)=>{
    let song = document.querySelector(".songList");
    data.forEach((ele) => {
        let eachsong = document.querySelector(".song");
        let str = ``
        str +=`
        <div class = "song">
            <img class="cover" src=${ele.track.album.images[2].url} alt="Error">
            <span id="1" class="songName">${ele.track.name}<br>${ele.track.artists[0].name}</span>
            <span id="1" class="songName">5 days ago</span> 

            
            <span class="hide">${millisToMinutesAndSeconds(ele.track.duration_ms)}</span>
        </div>       
        `
        song.innerHTML += str;

    });
    
}
async function displayData(playlistID,TOKEN){
    try {
        let data = await getTrack(playlistID,TOKEN);
        renderingTheData(data.items)
        topHeading(data.items)

    } catch (error){
        refreshToken();
        window.location.reload();
    }
    
}      
displayData(playlistID,TOKEN); 

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
let banner = document.querySelector(".banner");
const topHeading = (data)=>{
    let str =``;
    data.forEach((ele,ind)=>{
        if(ind == 0){
            str = `
        <img class="likedImg"
        src=${ele.track.album.images[0].url}
        alt="">
        <div class="likedHead">
            <div class="likedTwo">Playlist</div>
            <div class="likedOne">${ele.track.name}</div>
            <div class="likedTwo">${ele.track.artists[0].name}</div><br>
            <div class="likedTwo">@topHitsAllTime 20 Songs</div>
        </div>`
        }
        

    
    })
    banner.innerHTML = str;
}

let  playbutton = ``;
    playbutton += `<button name="play"></button>
    <i class="fa-regular fa-heart fa-3x"
        style="margin-left: 30px;  color: rgb(214, 200, 200); font-weight: lighter;"></i>
    <i class="fa-solid fa-ellipsis fa-3x" style="margin-left: 30px; color: rgb(222, 210, 210);"></i>`
    
document.querySelector(".play-button").innerHTML = playbutton;

let tablehead = ``;

    tablehead += ` <span class="hide">TITLE#</span>
    <span class="hide">ALBUM</span>
    <span class="favourite">DATED ADDED</span>
    <span class="hide"><i class="fa fa-solid fa-clock"></i></span>`
document.querySelector(".tableHead").innerHTML = tablehead
