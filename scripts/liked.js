import { left_nav, top_nav_login, playerBottom } from "../utils/components.js";
import { refreshToken, getTrack } from "../utils/api_calls.js";
import { millisToMinutesAndSeconds } from "../utils/utilities.js";

const nav_left_container = document.querySelector('#left_nav');
const nav_top_container = document.querySelector('#top_nav');
const nav_bottom = document.querySelector('#page_bottom');

nav_top_container.innerHTML = top_nav_login();
nav_bottom.innerHTML = playerBottom();
nav_left_container.innerHTML = left_nav();

const playing_img = document.querySelector('#playing_img');
const player_song_name = document.querySelector('#player_song_name');
const player_artist_name = document.querySelector('#player_artist_name');
const bottom_play_button = document.querySelector('#bottom_play_button');
const previous_button = document.querySelector("#previous_button");
const next_button = document.querySelector('#next_button');
const progress_bar = document.querySelector('#progress_bar');
const curr_song_time = document.querySelector('#curr_song_time');
let current_user = localStorage.getItem("spotify_current_user");
let User_name = (localStorage.getItem("spotify_current_user")) || "";
let banner = document.querySelector(".banner");
let songs_body = document.querySelector("#songs_body");
let play_button = document.querySelector('#play_button');
let songs_array = [];
let curr_song = new Audio("");
let curr_song_index = 0;

const user_pop = document.querySelectorAll('.user_pop')[0];
const user_options = document.querySelector('#user_options');
const logout_button = document.querySelector('#logout_btn');
let login_flag = JSON.parse(localStorage.getItem('spotify_login_flag'));

if (!login_flag) {
    location = "/";
}

user_pop.onclick = () => {
    let val = user_options.style.visibility;
    if (val == "hidden") {
        user_options.style.visibility = "visible";
    } else {
        user_options.style.visibility = "hidden";
    }
}

logout_button.onclick = () => {
    localStorage.setItem('spotify_login_flag', JSON.stringify(false));
    location.reload();
}

curr_song.ontimeupdate = () => {
    let curr_time = curr_song.currentTime;
    if (Math.floor(curr_time) < 10) {
        curr_song_time.textContent = "0:0" + Math.floor(curr_time);
    } else {
        curr_song_time.textContent = "0:" + Math.floor(curr_time);
    }
    let percent = (curr_time / 30) * 100;
    progress_bar.style.right = `${100 - percent}%`;
}

const displayBanner = (data) => {
    let str = `
        <div class="banner_image_container">
            <img class="banner_image" id="banner_img_id" src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png">
        </div>
        <div class="banner_description">
            <div class="playlist_header">Playlist</div>
            <div class="playlist_name" id="banner_playlist_name">Liked Songs</div>
            <div class="playlist_description" id="banner_playlist_discription"></div>
            <div class="playlist_info">${User_name} &nbsp;.&nbsp; ${data.length}</div>
        </div>`;
    banner.innerHTML = str;
}

const displaySongs = (data) => {
    songs_body.innerHTML = "";
    data.map((element, index) => {
        let tr = document.createElement('tr');
        tr.setAttribute("class", "songRow");

        let td1 = document.createElement("td");
        let span1 = document.createElement("span");
        span1.innerText = index + 1;
        td1.append(span1);

        let td2 = document.createElement("td");

        let d1 = document.createElement("div");
        d1.setAttribute("class", "title_container");

        let d2 = document.createElement("div");
        d2.setAttribute("class", "song_avatar_container");
        let img1 = document.createElement("img");
        img1.setAttribute("src", element.track.album.images[2].url);
        d2.append(img1);

        let d3 = document.createElement("div");
        d3.setAttribute("class", "song_description");

        let d4 = document.createElement("div");
        d4.setAttribute("class", "song_name");
        let span2 = document.createElement("span");
        span2.innerText = element.track.name;
        d4.append(span2);

        let d5 = document.createElement("div");
        d5.setAttribute("class", "song_artist");
        let span3 = document.createElement("span");
        span3.innerText = element.track.artists[0].name;
        d5.append(span3);

        d3.append(d4, d5);
        d1.append(d2, d3);
        td2.append(d1);

        let td3 = document.createElement("td");
        let d6 = document.createElement("div");
        d6.setAttribute("class", "song_album");
        let span4 = document.createElement("span");
        span4.innerText = element.track.album.name;
        d6.append(span4);
        td3.append(d6);

        let td4 = document.createElement("td");
        let d7 = document.createElement("div");
        d7.setAttribute("class", "liked_btn_duration");

        let span5 = document.createElement("span");
        span5.setAttribute("class", "liked_btn");

        let btn1 = document.createElement("button");
        btn1.setAttribute("Class", "heart_button");
        btn1.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 uPxdw"><path d="M15.724 4.22A4.313 4.313 0 0012.192.814a4.269 4.269 0 00-3.622 1.13.837.837 0 01-1.14 0 4.272 4.272 0 00-6.21 5.855l5.916 7.05a1.128 1.128 0 001.727 0l5.916-7.05a4.228 4.228 0 00.945-3.577z"></path></svg>`;
        btn1.addEventListener("click", function () { removelocalstrg(data, index) });
        span5.append(btn1);
        let span6 = document.createElement("span");
        span6.setAttribute("class", "song_duration");
        span6.innerText = millisToMinutesAndSeconds(element.track.duration_ms);
        d7.append(span5, span6);
        td4.append(d7);
        tr.append(td1, td2, td3, td4);

        songs_body.append(tr);
        td2.onclick = () => {
            playMusic(index);
            curr_song.play();
        }
    });
}
let removelocalstrg = (array, index) => {
    array.splice(index, 1);
    let user_array = JSON.parse(localStorage.getItem("spotify_liked_songs")) || {};
    user_array[current_user] = array;
    localStorage.setItem("spotify_liked_songs", JSON.stringify(user_array));
    if (array.length > 0) {
        displayData();
    }
    else {
        window.location.reload();
    }
}

function displayData() {
    let user_array = JSON.parse(localStorage.getItem("spotify_liked_songs")) || {};
    let liked = user_array[current_user] || [];
    displayBanner(liked);
    displaySongs(liked);
    songs_array = [...liked];
}


function playMusic(index) {
    curr_song_index = index;
    playing_img.src = songs_array[index].track.album.images[2].url;
    player_song_name.textContent = songs_array[index].track.album.name;
    player_artist_name.textContent = songs_array[index].track.artists[0].name;
    curr_song.src = songs_array[index].track.preview_url;

    // Banner image setting
    document.getElementById("banner_img_id").setAttribute("src", songs_array[index].track.album.images[0].url)
    document.getElementById("banner_playlist_name").innerText = songs_array[index].track.name;
    document.getElementById("banner_playlist_discription").innerText = songs_array[index].track.artists[0].name;

    bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
            <path
              d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z">
            </path>
          </svg>`;
}

play_button.onclick = () => {
    playMusic(0);
    curr_song.play();
}

bottom_play_button.onclick = () => {
    try {
        if (curr_song.paused) {
            bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
            <path
              d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z">
            </path>
          </svg>`;
            curr_song.play();
        } else {
            bottom_play_button.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
            <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z">
            </path>
          </svg>`;
            curr_song.pause();
        }
    } catch (error) { }
}

next_button.onclick = () => {
    if (curr_song_index < songs_array.length) {
        playMusic(++curr_song_index);
        curr_song.play();
    }
}

previous_button.onclick = () => {
    if (curr_song_index > 0) {
        playMusic(--curr_song_index);
        curr_song.play();
    }
}

displayData();

const username = document.querySelectorAll('.user_name');

username.forEach(element => {
    element.textContent = localStorage.getItem('spotify_current_user');
});

const back_button = document.querySelector("#back_button");
const forward_button = document.querySelector("#forward_button");

try {
    forward_button.onclick = () => {
        history.forward();
    }
    back_button.onclick = () => {
        history.back();
    }
} catch { }