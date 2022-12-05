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
const like_playlist_button = document.querySelector("#like_playlist_button");
let TOKEN = (localStorage.getItem("spotify_token")) || "";
let local_obj = JSON.parse(localStorage.getItem("spotify_curr_playlist")) || "";
let liked_songs = JSON.parse(localStorage.getItem("spotify_liked_songs")) || {};
let liked_playlists = JSON.parse(localStorage.getItem("spotify_liked_playlists")) || {};
let current_user = localStorage.getItem("spotify_current_user");
let playlistID = local_obj.id;
document.title = local_obj.name;
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
            <img class="banner_image" id="banner_img_id" src="${data[0].track.album.images[0].url}">
        </div>
        <div class="banner_description">
            <div class="playlist_header">Playlist</div>
            <div class="playlist_name" id="banner_playlist_name">${local_obj.name}</div>
            <div class="playlist_description" id="banner_playlist_discription">${data[0].track.artists[0].name}, etc</div>
            <div class="playlist_info">Spotify &nbsp;.&nbsp; 20 Songs</div>
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
        btn1.innerHTML = `<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 uPxdw"><path d="M1.69 2A4.582 4.582 0 018 2.023 4.583 4.583 0 0111.88.817h.002a4.618 4.618 0 013.782 3.65v.003a4.543 4.543 0 01-1.011 3.84L9.35 14.629a1.765 1.765 0 01-2.093.464 1.762 1.762 0 01-.605-.463L1.348 8.309A4.582 4.582 0 011.689 2zm3.158.252A3.082 3.082 0 002.49 7.337l.005.005L7.8 13.664a.264.264 0 00.311.069.262.262 0 00.09-.069l5.312-6.33a3.043 3.043 0 00.68-2.573 3.118 3.118 0 00-2.551-2.463 3.079 3.079 0 00-2.612.816l-.007.007a1.501 1.501 0 01-2.045 0l-.009-.008a3.082 3.082 0 00-2.121-.861z"></path></svg>`;
        btn1.addEventListener("click", function () { addtolocalstrg(element) });
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


// liked function
let addtolocalstrg = (obj) => {
    let user = localStorage.getItem('spotify_current_user');
    let array = liked_songs[user];
    if (!array) {
        liked_songs[user] = [];
        liked_songs[user].push(obj);
    } else {
        let duplicate = liked_songs[user].filter(element => JSON.stringify(element) == JSON.stringify(obj));
        if (duplicate.length == 0) {
            liked_songs[user].push(obj);
        } else {
            alert("This song is already liked by you");
        }
    }
    localStorage.setItem("spotify_liked_songs", JSON.stringify(liked_songs));
}

async function displayData(playlistID) {
    try {
        let data = await getTrack(playlistID, TOKEN);
        displayBanner(data.items)
        displaySongs(data.items);
        songs_array = [...data.items];

        like_playlist_button.onclick = () => {
            let current_playlist = JSON.parse(localStorage.getItem("spotify_curr_playlist"));
            
            let array = liked_playlists[current_user];
            if (array) {
                let duplicate = array.filter(element => element.id == current_playlist.id);
                if (duplicate.length == 0) {
                    liked_playlists[current_user].push(current_playlist);
                } else {
                    alert("This playlist is already liked by you");
                }
            } else {
                liked_playlists[current_user] = [];
                liked_playlists[current_user].push(current_playlist);
            }
            localStorage.setItem("spotify_liked_playlists", JSON.stringify(liked_playlists));
            
        }
    } catch (error) {
        await refreshToken();
    }

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

displayData(playlistID);

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