import { left_nav, top_nav_login, playerBottom } from "../utils/components.js";
import { refreshToken, getAlbumTrack } from "../utils/api_calls.js";
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
let TOKEN = (localStorage.getItem("spotify_token")) || "";
let local_obj = JSON.parse(localStorage.getItem("spotify_current_album")) || "";
let albumID = local_obj.id;
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
            <img class="banner_image" id="banner_img_id" src="${local_obj.img}">
        </div>
        <div class="banner_description">
            <div class="playlist_header">Playlist</div>
            <div class="playlist_name" id="banner_playlist_name">${local_obj.name}</div>
            <div class="playlist_description" id="banner_playlist_discription">Album</div>
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
    img1.setAttribute("src", local_obj.img);
    d2.append(img1);

    let d3 = document.createElement("div");
    d3.setAttribute("class", "song_description");

    let d4 = document.createElement("div");
    d4.setAttribute("class", "song_name");
    let span2 = document.createElement("span");
    span2.innerText = element.name;
    d4.append(span2);

    let d5 = document.createElement("div");
    d5.setAttribute("class", "song_artist");
    let span3 = document.createElement("span");
    span3.innerText = element.artists[0].name;
    d5.append(span3);

    d3.append(d4, d5);
    d1.append(d2, d3);
    td2.append(d1);

    let td4 = document.createElement("td");
    let d7 = document.createElement("div");
    d7.setAttribute("class", "liked_btn_duration");

    let span6 = document.createElement("span");
    span6.setAttribute("class", "song_duration");
    span6.innerText = millisToMinutesAndSeconds(element.duration_ms);
    d7.append(span6);
    td4.append(d7);
    tr.append(td1, td2, td4);

    songs_body.append(tr);
    td2.onclick = () => {
      playMusic(index);
      curr_song.play();
    }
  });
}

async function displayData(albumID) {
  try {
    let data = await getAlbumTrack(albumID, TOKEN);
    displayBanner(data.items)
    displaySongs(data.items);
    songs_array = [...data.items];
  } catch (error) {
    await refreshToken();
  }

}

function playMusic(index) {
  playing_img.src = local_obj.img;
  player_song_name.textContent = songs_array[index].name;
  player_artist_name.textContent = songs_array[index].artists[0].name;
  curr_song.src = songs_array[index].preview_url;

  // Banner image setting
  document.getElementById("banner_playlist_name").innerText = songs_array[index].name;
  document.getElementById("banner_playlist_discription").innerText = songs_array[index].artists[0].name;

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

displayData(albumID);

const username = document.querySelectorAll('.user_name');

username.forEach(element => {
  element.textContent = localStorage.getItem('spotify_current_user');
});